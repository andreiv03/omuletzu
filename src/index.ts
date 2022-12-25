import fs from "fs";
import path from "path";

import { Client, Collection, GatewayIntentBits } from "discord.js";

import type { Event } from "./interfaces";
import { constants } from "./utils/constants";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const eventsDirectoryPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsDirectoryPath).filter((file) => file.endsWith(".js"));

eventFiles.forEach(async (file) => {
  const { event }: { event: Event } = await import(path.join(eventsDirectoryPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
});

client.login(constants.SECRET_TOKEN);
