import { serve } from "../deps.ts";
const port = 3005;
const s = serve({ port });
console.log("deno_http listen on", port);
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
