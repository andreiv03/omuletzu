import fs from "fs";
import path from "path";

import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";

import constants from "../constants";
import type { Command } from "../interfaces/command";

const deployCommands = async () => {
  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  
  for (const file of commandFiles) {
    const { default: command } = await import(path.join(commandsPath, file)) as { default: Command };
    commands.push(command.data.toJSON());
  }
  
  try {
    const rest = new REST({ version: "10" }).setToken(constants.SECRET_TOKEN);
    await rest.put(Routes.applicationGuildCommands(constants.CLIENT_ID, constants.DEV_GUILD_ID), { body: commands });
  } catch (error) {
    console.error(error);
  }
}

deployCommands();