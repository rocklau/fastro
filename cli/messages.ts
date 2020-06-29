import { version } from "../mod.ts";

export const default_msg = `fastro: try 'fastro --help' for more information`;
export const help_msg = `Usage: 
  fastro [command] [options]

Commands:
  init [options]        create fastro.json & default handler
  serve [options]       run server with default port (3000)
  register [options]    create user & get uuid
  deploy                deploy app to server

Reset Token Commands:
  otp                   send one time password (OTP) to your email
  token [options]       reset user token

Options:
  --help                show manual
  --version             show version

try 'fastro [command] --help' for detail information about specific command
`;

export const serve_msg = `Usage: 
  fastro serve [options]

Options:
  --port : custom port

Example:
  fastro serve --port 5000
`;

export const register_msg = `Usage: 
  fastro register [options]

Options:
  --email : your email

Example:
  fastro register --email your@email.com
`;

export const email_msg = `Error: email empty!

${register_msg}`;

export const deploy_msg = `Usage: 
  fastro deploy
`;

export const init_msg = `Usage: 
  fastro init [option]

Options:
  --app : your app name

Example:
  fastro init --app myapp
`;

export const otp_msg = `Usage: 
  fastro otp
`;

export const token_msg = `Usage: 
  fastro token [option]

Options:
  --otp : your otp. get from 'fastro otp' command.

Example:
  fastro token --otp 1234567
`;

export const harmful_msg =
  `Deployment failed. For security reasons, you are not allowed to run Deno runtime API.
`;

export const handler_content =
  `import { Request } from "https://raw.githubusercontent.com/fastrodev/fastro/v${version.fastro}/mod.ts";

export function handler(req: Request) {
  req.send("hello world");
}
`;
