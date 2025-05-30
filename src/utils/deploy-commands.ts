import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

import { ENV } from "@/config/constants";
import type { Command } from "@/types/command";

const TAG = "[DEPLOY_COMMANDS]";

const deployCommands = async () => {
	try {
		const commandsDir = path.resolve(__dirname, "../commands");
		const files: string[] = [];
		const commands: Command[] = [];

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

				commands.push(command);
				console.log(`${TAG} Loaded command: /${command.data.name}`);
			} catch (error) {
				console.error(`${TAG} Failed to load ${file}:`, error);
			}
		}

		const rest = new REST({ version: "10" }).setToken(ENV.SECRET_TOKEN);

		await rest.put(Routes.applicationCommands(ENV.APPLICATION_ID), {
			body: commands.map((command) => command.data.toJSON()),
		});

		console.log(`${TAG} Deployed ${commands.length} command(s) globally.`);
	} catch (error) {
		console.error(`${TAG} Deployment failed:`, error);
	}
};

deployCommands();
