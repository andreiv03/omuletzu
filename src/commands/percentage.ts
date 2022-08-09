import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("percentage")
    .setDescription("Cât la sută?")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Ce fel de procentaj?")
        .setRequired(true)
        .addChoices(
          { name: "gay", value: "gay" },
          { name: "simp", value: "simp"}
        )),
  execute: async (interaction: CommandInteraction) => {
    const percentage = Math.floor(Math.random() * 101);
    const type = interaction.options.get("type")?.value;
    
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`Cât la sută ești ${type}?`)
      .setDescription(`**${interaction.user.tag}** este ${percentage}% ${type}.`)
      .setThumbnail(interaction.user.displayAvatarURL());

    await interaction.reply({ embeds: [embed] });
  }
};