import { BASE_URL } from "./handlers.ts";
import { harmful_msg } from "./messages.ts";
function getRecursiveFolder(folders: string[]) {
  let tmp: string = "";
  let tmpList: string[] = [];

  function filter(file: string) {
    const [x] = tmpList
      .map((v, i) => {
        return { v, i };
      })
      .filter((i) => file.includes(i.v));

    if (x) tmpList[x.i] = file;
    else tmpList.push(file);
  }

  folders.forEach((folder) => {
    if (!tmp.includes(folder)) {
      tmp = folder;
      filter(folder);
    }
  });
  return tmpList;
}

async function createFolders(
  app: string,
  folder: string,
  id: string,
  owner: string,
  token: string,
  folders: string[],
) {
  const url = `${BASE_URL}/make_folder/${app}`;
  const folderList = getRecursiveFolder(folders);
  const body = folderList.length > 0
    ? JSON.stringify({ app, folder: folderList, id, owner })
    : JSON.stringify({ app, folder: [folder], id, owner });
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "token": token,
      "Content-Type": "application/json",
    },
    body,
  });
  return await r.text();
}

function sendFile(id: string, files: string[], owner: string) {
  files.forEach(async (file) => {
    const pathFile = file.replace("./", "");
    const url = `${BASE_URL}/deploy/${id}/${pathFile}`;
    const sendFile = await Deno.readTextFile(pathFile);
    const r = await fetch(url, {
      method: "POST",
      body: sendFile,
    });
    const h = await r.text() === "harmful";
    if (h) {
      return console.log(
        {
          file: pathFile,
          deploy: "failed",
          message: harmful_msg,
        },
      );
    }
    const status = {
      file: pathFile,
      deploy: r.ok ? "success" : "failed",
    };
    console.log(status);
  });
}

let folderList: string[] = [];
const readDir = async (target: string) => {
  let files: string[] = [];
  const results = Deno.readDir(target);
  for await (const dirEntry of results) {
    let file = target + "/" + dirEntry.name;
    const folder = file.substring(2, file.length);
    if (dirEntry.isDirectory) {
      folderList.push(folder);
      const [fls] = await readDir(file);
      files = files.concat(fls);
    } else {
      files.push(file);
    }
  }
  return [files, folderList];
};

export async function deploy() {
  try {
    const config = await Deno.readTextFile("app.json");
    const user = await Deno.readTextFile("fastro.json");
    const { app, folder, id } = JSON.parse(config);
    const { uuid: owner, token } = JSON.parse(user);
    const [files, folders] = await readDir(`./${folder}`);
    const promise = Promise.resolve();
    promise
      .then(async () =>
        await createFolders(app, folder, id, owner, token, folders)
      )
      .then((result) => {
        if (result === "update_ok" || result === "make_folder_ok") {
          return sendFile(id, files, owner);
        }
        console.error(JSON.parse(result));
      });
  } catch (error) {
    const message = error.name === "NotFound"
      ? "File app.json or fastro.json not found. Init your app create account first"
      : error.message;
    console.error({ error: true, message });
  }
}
