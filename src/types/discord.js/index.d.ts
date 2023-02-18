import type { Collection } from "discord.js";

import type { Command } from "types/commands";
import type { Event } from "types/events";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    events: Collection<string, Event>;
  }
}
