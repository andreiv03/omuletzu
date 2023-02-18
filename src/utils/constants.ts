import type { ColorResolvable } from "discord.js";

export const constants = {
  ACCENT_COLOR: "#FACA5C" as ColorResolvable,
  SECRET_TOKEN: process.env["SECRET_TOKEN"] as string
};

Object.entries(constants).forEach(([key, value]) => {
  if (typeof value === "undefined") throw new Error(`${key} not found!`);
});
