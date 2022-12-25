import { type CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder().setName("simp").setDescription("Cât la sută ești simp?"),
  execute: async (interaction: CommandInteraction) => {
    const percentage = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Cât la sută ești simp?")
      .setDescription(`**${interaction.user.tag}**, ești ${percentage}% simp! :peach:`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: `${percentage}% simp`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
