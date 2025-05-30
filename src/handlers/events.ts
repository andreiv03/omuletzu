import type { Client } from "discord.js";
import fs from "fs";
import path from "path";

import type { Event } from "@/types/event";

const TAG = "[EVENTS_HANDLER]";

export const eventsHandler = async (client: Client<boolean>) => {
	const eventsDir = path.resolve(__dirname, "../../dist/events");
	const files: string[] = [];

	try {
		// Safe: reading internal build directory, not user input
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const filesDir = fs.readdirSync(eventsDir);
		files.push(...filesDir.filter((file) => file.endsWith(".js")));
	} catch {
		console.warn(`${TAG} Directory not found or unreadable: ${eventsDir}`);
		return;
	}

	for (const file of files) {
		try {
			const { event }: { event: Event } = await import(path.join(eventsDir, file));

			if (!event.name || typeof event.run !== "function") {
				console.warn(`${TAG} Skipped invalid event: ${file}`);
				continue;
			}

			if (event.once) {
				client.once(event.name, (...args) => event.run(...args));
			} else {
				client.on(event.name, (...args) => event.run(...args));
			}

			client.events.set(event.name, event);
			console.log(`${TAG} Registered event: ${event.name}`);
		} catch (error) {
			console.error(`${TAG} Failed to load ${file}:`, error);
		}
	}
};
