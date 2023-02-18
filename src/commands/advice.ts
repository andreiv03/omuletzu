import axios from "axios";
import { type CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import type { Command } from "types/commands";

interface Advice {
  advice: string;
  id: string;
}

const data = new SlashCommandBuilder();
data.setName("advice");
data.setDescription("Generate a random advice.");

export const command: Command = {
  data,
  run: async (interaction: CommandInteraction) => {
    const response = await axios.get("https://api.adviceslip.com/advice");
    const advice: Advice = { ...response.data.slip };

    const embed = new EmbedBuilder();
    embed.setColor("Random");
    embed.setTitle("Advice Generator");
    embed.setDescription(`${advice.advice}`);
    embed.setFooter({
      iconURL: interaction.user.displayAvatarURL(),
      text: `Advice #${advice.id}`
    });

    await interaction.reply({ embeds: [embed] });
  }
};
