import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("penis")
    .setDescription("Cât de mare ai penisul?"),
  execute: async (interaction: CommandInteraction) => {
    let centimeters = Math.floor(Math.random() * 26);
    let penis = "8" + "=".repeat(centimeters) + "D", reply = "";

    if (centimeters == 0) reply = `Coaie... ăsta nu e penis!\n**${interaction.user.tag}**`;
    else if (centimeters <= 12) reply = `Se putea și mai bine...\n**${interaction.user.tag}**`;
    else if (centimeters <= 20) reply = `Mult noroc în viață, tinere!\n**${interaction.user.tag}**`;
    else reply = `Pola Negro aiciaa!!\n**${interaction.user.tag}**`;
    
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Cât de mare ai penisul?")
      .setDescription(`${reply}, ai ${centimeters >= 20 ? centimeters + " de" : centimeters} cm! :banana:`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: penis, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};