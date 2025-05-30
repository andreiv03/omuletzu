import {
	type ColorResolvable,
	type CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";

import axios from "@/config/axios";
import { ENV } from "@/config/constants";
import type { Command } from "@/types/command";

interface AdviceResponse {
	slip: {
		advice: string;
		id: number;
	};
}

const TAG = "[ADVICE_COMMAND]";

const data = new SlashCommandBuilder()
	.setName("advice")
	.setDescription("Generate a random piece of advice.");

export const command: Command = {
	data,
	run: async (interaction: CommandInteraction) => {
		const ADVICE_API_URL = "https://api.adviceslip.com/advice";

		try {
			const { data } = await axios.get<AdviceResponse>(ADVICE_API_URL);
			const advice = data.slip;

			const embed = new EmbedBuilder()
				.setColor(ENV.ACCENT_COLOR as ColorResolvable)
				.setTitle("🧠 Advice Generator")
				.setDescription(advice.advice)
				.setFooter({
					iconURL: interaction.user.displayAvatarURL(),
					text: `Advice #${advice.id}`,
				});

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error(`${TAG} Failed to fetch advice:`, error);

			await interaction.reply({
				content: "Sorry, I couldn't fetch an advice right now. Try again later!",
				ephemeral: true,
			});
		}
	},
};
