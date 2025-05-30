import type { CacheType, Interaction } from "discord.js";
import type { Event } from "@/types/event";

const TAG = "[INTERACTION_CREATE_EVENT]";

export const event: Event<"interactionCreate"> = {
	name: "interactionCreate",
	once: false,
	run: async (interaction: Interaction<CacheType>) => {
		const ERROR_REPLY = "There was an error while executing this command.";

		if (!interaction.isChatInputCommand()) {
			return;
		}

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.warn(`${TAG} Command not found: /${interaction.commandName}`);
			return;
		}

		try {
			await command.run(interaction);
		} catch (error) {
			console.error(`${TAG} Error in /${interaction.commandName}:`, error);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: ERROR_REPLY,
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: ERROR_REPLY,
					ephemeral: true,
				});
			}
		}
	},
};
