import fs from "fs";
import path from "path";

import { REST } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";

import { constants } from "../constants";
import type { Command } from "../interfaces/command";

const deployCommands = async () => {
  try {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandsDirectoryPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs.readdirSync(commandsDirectoryPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const { default: command } = (await import(path.join(commandsDirectoryPath, file))) as { default: Command };
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(constants.SECRET_TOKEN);
    await rest.put(Routes.applicationCommands(constants.APPLICATION_ID), { body: commands });
  } catch (error) {
    console.error(error);
  }
};

deployCommands();
