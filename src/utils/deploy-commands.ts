import fs from "fs";
import path from "path";

import { Collection, REST, Routes } from "discord.js";

import { constants } from "utils/constants";
import type { Command } from "types/commands";

const deployCommands = async () => {
  try {
    const commands: Collection<string, Command> = new Collection();

    const directoryPath = path.join(__dirname, "..", "commands");
    const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const { command }: { command: Command } = await import(path.join(directoryPath, file));
      commands.set(command.data.name, command);
    }

    const APPLICATION_ID = "747112444253700147";
    const rest = new REST({ version: "10" }).setToken(constants.SECRET_TOKEN);
    await rest.put(Routes.applicationCommands(APPLICATION_ID), {
      body: [...commands.values()].map((command: Command) => command.data.toJSON())
    });

    console.log("Commands deployed successfully!");
  } catch (error) {
    console.error(error);
  }
};

deployCommands();
