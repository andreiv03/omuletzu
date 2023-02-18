import fs from "fs";
import path from "path";

import type { Client } from "discord.js";
import type { Event } from "types/events";

export const eventsHandler = (client: Client<boolean>) => {
  const directoryPath = path.join(__dirname, "..", "..", "dist", "events");
  const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith(".js"));

  files.forEach(async (file) => {
    const { event }: { event: Event } = await import(path.join(directoryPath, file));
    client.events.set(event.name, event);

    if (event.once) client.once(event.name, (...args) => event.run(...args));
    else client.on(event.name, (...args) => event.run(...args));
  });
};
