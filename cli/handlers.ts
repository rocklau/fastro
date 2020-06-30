import { Fastro, FastroError, version } from "../mod.ts";
import { parse, v4 } from "../deps.ts";
import { email_msg, handler_content, token_msg } from "./messages.ts";
import { deploy as doDeploy } from "./deploy_handler.ts";

function errorHandler(err: Error) {
  if (err.name === "NotFound") {
    throw FastroError(
      "CREATE_SERVER_ERROR",
      new Error("file `app.json` not found"),
    );
  }
  if (err.name === "SyntaxError") {
    throw FastroError(
      "CREATE_SERVER_ERROR",
      new Error("file `app.json` invalid"),
    );
  }
  throw err;
}

async function createServer() {
  try {
    const server = new Fastro();
    const cwd = Deno.cwd();
    const config = await Deno.readTextFile("app.json");
    const { app, folder } = JSON.parse(config);
    const handlers: Handler[] = [];
    type Handler = { path: string; file: any };
    const function_list: any[] = [];
    server
      .function("/:prefix/:handler", async (req) => {
        try {
          const { prefix, handler } = req.parameter;
          const fileImport = `file://${cwd}/${folder}/${handler}.ts`;
          if (!prefix) return server.forward(req);
          if (prefix !== app) return req.send("not found");
          if (prefix && !handler) return req.send(`${prefix} root`);
          if (
            prefix && handler && req.functionParameter.length < 1 &&
            !function_list.includes(fileImport)
          ) {
            const file = await import(fileImport);
            handlers.push({ path: fileImport, file });
            function_list.push(fileImport);
          }
          const [h] = handlers.filter((h) => h.path === fileImport);
          if (!h) return server.forward(req);
          h.file.handler(req);
        } catch (error) {
          server.forward(req);
        }
      })
      .get("/", (req) => req.send("root"));
    return server;
  } catch (error) {
    throw errorHandler(error);
  }
}

export async function serve(port?: number) {
  const server = await createServer();
  const PORT = port ? port : 3000;
  await server.listen({ port: PORT }, (err) => {
    if (err) throw err;
    console.info(`Fastro listen on port`, PORT);
  });
}

export async function init(appName?: string) {
  try {
    const cwd = Deno.cwd().split("/");
    const app = appName ? appName : cwd[cwd.length - 1];
    const encoder = new TextEncoder();
    const id = v4.generate();
    const folder = "handler";
    const config = { app, id, folder };
    const data = encoder.encode(JSON.stringify(config));
    await Deno.mkdir(folder, { recursive: true });
    await Deno.writeFile("app.json", data);
    const handler = encoder.encode(handler_content);
    const handlerPath = `${folder}/hello.ts`;
    await Deno.writeFile(handlerPath, handler);
    console.log(config);
  } catch (error) {
    console.error("INIT_ERROR", error.message);
  }
}

export async function getVersion() {
  const file = await import("../mod.ts");
  console.log(file.version.fastro);
}

function validateEmail(email: string) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export async function register(email: string) {
  try {
    if (!email) return console.info(email_msg);
    if (!validateEmail(email)) {
      return console.error({ error: true, message: "invalid email." });
    }
    const url = `${BASE_URL}/register`;
    const r = await fetch(url, {
      method: "POST",
      body: email,
    });
    const res = await r.text();
    const credential = JSON.parse(res);
    if (credential.message === "user already exist") {
      return console.error({ error: true, message: res });
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(res);
    await Deno.writeFile("fastro.json", data);
    console.log(JSON.parse(res));
  } catch (error) {
    console.log(error);
    console.error("ERROR_REGISTER:", error.message);
  }
}

export let BASE_URL: string;

export function getArguments(args: string[]) {
  const {
    _ : commands,
    email,
    port,
    help,
    version,
    app,
    env,
    otp,
  } = parse(args);
  BASE_URL = env === "local"
    ? "http://api.fastro.local"
    : "https://api.fastro.dev";
  return { commands, email, port, help, version, app, otp };
}

export function deploy() {
  return doDeploy();
}

export async function token(otp: string) {
  try {
    if (!otp) return console.error(`Otp empty. ${token_msg}`);
    const user = await Deno.readTextFile("fastro.json");
    const { uuid } = JSON.parse(user);
    const url = `${BASE_URL}/token`;
    const data = { otp, uuid };
    const r = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const response = await r.text();
    const credential = JSON.parse(response);
    if (credential.error) return console.log(credential);
    console.log(credential);
    const encoder = new TextEncoder();
    const newToken = encoder.encode(response);
    await Deno.writeFile("fastro.json", newToken);
  } catch (error) {
    console.error("ERROR_TOKEN", error.message);
  }
}

export async function otp() {
  try {
    const user = await Deno.readTextFile("fastro.json");
    const { uuid, email } = JSON.parse(user);
    const url = `${BASE_URL}/otp`;
    const data = JSON.stringify({ uuid, email });
    const r = await fetch(url, {
      method: "POST",
      body: data,
    });
    const response = await r.text();
    console.log(JSON.parse(response));
  } catch (error) {
    console.error("OTP_ERROR", error.message);
  }
}
