import type { Collection } from "discord.js";

import type { Command } from "@/types/command";
import type { Event } from "@/types/event";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    events: Collection<string, Event>;
  }
}
