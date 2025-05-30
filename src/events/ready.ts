import type { Client } from "discord.js";
import type { Event } from "@/types/event";

const TAG = "[READY_EVENT]";

export const event: Event<"ready"> = {
	name: "ready",
	once: true,
	run: async (client: Client<true>) => {
		const userTag = client.user.tag ?? "unknown bot";
		const guildCount = client.guilds.cache.size;

		console.log(`${TAG} ${userTag} is online and connected to ${guildCount} server(s).`);
	},
};
