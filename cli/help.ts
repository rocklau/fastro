import {
  help_msg,
  default_msg,
  serve_msg,
  register_msg,
  init_msg,
  deploy_msg,
  otp_msg,
  token_msg,
} from "./messages.ts";

export function helpCmd() {
  console.log(help_msg);
}

export function defaultHelp() {
  console.log(default_msg);
}

export function versionHelp() {
}

export function serveHelp() {
  console.log(serve_msg);
}

export function registerHelp() {
  console.log(register_msg);
}

export function initHelp() {
  console.log(init_msg);
}

export function deployHelp() {
  console.log(deploy_msg);
}

export function otpHelp() {
  console.log(otp_msg);
}

export function tokenHelp() {
  console.log(token_msg);
}
