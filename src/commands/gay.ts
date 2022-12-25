import { type CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder().setName("gay").setDescription("Cât la sută ești gay?"),
  execute: async (interaction: CommandInteraction) => {
    const percentage = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Cât la sută ești gay?")
      .setDescription(`**${interaction.user.tag}**, ești ${percentage}% gay! :rainbow_flag:`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: `${percentage}% gay`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
