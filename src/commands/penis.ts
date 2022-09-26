import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("penis")
    .setDescription("Cât de mare ai penisul?"),
  execute: async (interaction: CommandInteraction) => {
    const centimeters = Math.floor(Math.random() * 26);
    const penis = "8" + "=".repeat(centimeters) + "D";
    let reply = "";

    if (centimeters <= 4) reply = "Atât s-a putut...";
    else if (centimeters <= 12) reply = "Mică-mică, dar jucăușă!";
    else if (centimeters <= 20) reply = "Mult noroc în viață, tinere!";
    else reply = "Pola Negro aiciaa!!";

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Cât de mare ai penisul?")
      .setDescription(`${reply}\n**${interaction.user.tag}**, ai ${centimeters >= 20 ? centimeters + " de" : centimeters} cm! :banana:`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: penis
      });

    await interaction.reply({ embeds: [embed] });
  }
};
