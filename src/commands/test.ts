import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("da e un test"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("ooo ce tiganca frumoasa <@515826248027471904>");
  }
};