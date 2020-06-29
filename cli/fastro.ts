import * as handler from "./handlers.ts";
import * as help from "./help.ts";

const {
  commands: [command, arg],
  email,
  port,
  help: helpMsg,
  version,
  app,
  otp,
} = handler
  .getArguments(
    Deno.args,
  );

if (command && version) {
  console.log(`'fastro ${command} --version' is not valid command`);
} else if (command && helpMsg) {
  if (command === "init") help.initHelp();
  if (command === "serve") help.serveHelp();
  if (command === "register") help.registerHelp();
  if (command === "deploy") help.deployHelp();
  if (command === "otp") help.otpHelp();
  if (command === "token") help.tokenHelp();
} else {
  if (command === "init") handler.init(app);
  if (command === "serve") handler.serve(port);
  if (command === "register") handler.register(email);
  if (command === "deploy") handler.deploy();
  if (command === "otp") handler.otp();
  if (command === "token") handler.token(otp);
}

if (!command && helpMsg) help.helpCmd();
if (!command && version) handler.getVersion();
else if (!command && !helpMsg) help.defaultHelp();
