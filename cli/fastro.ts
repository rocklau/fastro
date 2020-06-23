import { serve, getVersion, init, register, getArguments } from "./handlers.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const {args, email} = getArguments(Deno.args);
console.log(email)

// const [command, email] = Deno.args;
// if (command === "serve") serve();
// if (command === "init") init();
// if (command === "version") getVersion();
// if (command === "register") register(email);
