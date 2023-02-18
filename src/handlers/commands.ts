import fs from "fs";
import path from "path";

import type { Client } from "discord.js";
import type { Command } from "types/commands";

export const commandsHandler = (client: Client<boolean>) => {
  const directoryPath = path.join(__dirname, "..", "..", "dist", "commands");
  const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith(".js"));

  files.forEach(async (file) => {
    const { command }: { command: Command } = await import(path.join(directoryPath, file));
    client.commands.set(command.data.name, command);
  });
};
