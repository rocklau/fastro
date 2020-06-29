import { Request } from "https://raw.githubusercontent.com/fastrodev/fastro/v0.12.1/mod.ts";
export function handler(req: Request) {
  req.send("hello world");
}
