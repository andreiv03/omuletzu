import type { Interaction } from "discord.js";

export default {
  name: "interactionCreate",
  once: false,
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  }
};