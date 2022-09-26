import type { Collection } from "discord.js";
import type { Command } from "../interfaces/command";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }
}
