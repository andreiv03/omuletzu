import type { Interaction } from "discord.js";
import type { Event } from "../interfaces";

export const event: Event = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true
      });
    }
  }
};
