import { type CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../interfaces";

export const command: Command = {
  data: new SlashCommandBuilder().setName("iq").setDescription("Cât de mare ai IQ-ul?"),
  execute: async (interaction: CommandInteraction) => {
    const iq = Math.floor(Math.random() * 251);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Cât de mare ai IQ-ul?")
      .setDescription(`**${interaction.user.tag}**, ai ${iq} IQ! :brain:`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: `${iq} IQ`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
