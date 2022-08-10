import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("percentage")
    .setDescription("Cât la sută ești...?")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Alege o opțiune!")
        .setRequired(true)
        .addChoices(
          { name: "gay", value: "gay" },
          { name: "simp", value: "simp" }
        )),
  execute: async (interaction: CommandInteraction) => {
    const percentage = Math.floor(Math.random() * 101);
    const type = interaction.options.get("type")?.value;
    
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`Cât la sută ești ${type}?`)
      .setDescription(`**${interaction.user.tag}**, ești ${percentage}% ${type}! ${type === "gay" ? ":rainbow_flag:" : ":peach:"}`)
      .setThumbnail(interaction.user.displayAvatarURL());

    await interaction.reply({ embeds: [embed] });
  }
};