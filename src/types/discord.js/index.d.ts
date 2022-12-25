import type { Collection } from "discord.js";
import type { Command } from "../../interfaces";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
