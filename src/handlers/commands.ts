import type { Client } from "discord.js";
import fs from "fs";
import path from "path";

import type { Command } from "@/types/command";

const TAG = "[COMMANDS_HANDLER]";

export const commandsHandler = async (client: Client<boolean>) => {
	const commandsDir = path.resolve(__dirname, "../../dist/commands");
	const files: string[] = [];

	try {
		// Safe: reading internal build directory, not user input
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const filesDir = fs.readdirSync(commandsDir);
		files.push(...filesDir.filter((file) => file.endsWith(".js")));
	} catch {
		console.warn(`${TAG} Directory not found or unreadable: ${commandsDir}`);
		return;
	}

	for (const file of files) {
		try {
			const { command }: { command: Command } = await import(path.join(commandsDir, file));

			if (!command.data.name || typeof command.run !== "function") {
				console.warn(`${TAG} Skipped invalid command: ${file}`);
				continue;
			}

			client.commands.set(command.data.name, command);
			console.log(`${TAG} Loaded command: ${command.data.name}`);
		} catch (error) {
			console.error(`${TAG} Failed to load ${file}:`, error);
		}
	}
};
