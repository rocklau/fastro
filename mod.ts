export const version = {
  fastro: "0.12.1",
  deno: "1.1.2",
};
export * from "./core/server.ts";
export * from "./core/injection/mod.ts";

export {
  support,
  sendOk,
} from "./middlewares/sample.ts";

export {
  sample,
} from "./plugins/sample.ts";
