import { Client, Collection, IntentsBitField } from "discord.js";

import { commandsHandler } from "handlers/commands";
import { eventsHandler } from "handlers/events";
import { constants } from "utils/constants";

const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds);

const client = new Client({ intents });
client.commands = new Collection();
client.events = new Collection();

commandsHandler(client);
eventsHandler(client);

client.login(constants.SECRET_TOKEN);
