import fs from "fs";
import path from "path";

import { Client, Collection, GatewayIntentBits } from "discord.js";

import constants from "./constants";
import type { Event } from "./interfaces/event";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

eventFiles.forEach(async file => {
  const { default: event } = await import(path.join(eventsPath, file)) as { default: Event };
  
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
});

client.login(constants.SECRET_TOKEN);