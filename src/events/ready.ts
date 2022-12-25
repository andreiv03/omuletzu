import fs from "fs";
import path from "path";

import type { Client } from "discord.js";
import type { Command, Event } from "../interfaces";

export const event: Event = {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    try {
      const commandsDirectoryPath = path.join(__dirname, "..", "commands");
      const commandFiles = fs
        .readdirSync(commandsDirectoryPath)
        .filter((file) => file.endsWith(".js"));

      commandFiles.forEach(async (file) => {
        const { command }: { command: Command } = await import(
          path.join(commandsDirectoryPath, file)
        );
        client.commands.set(command.data.name, command);
      });

      console.log("Omuletzu' is online!");
    } catch (error) {
      console.error(error);
    }
  }
};
