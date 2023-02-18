import type { CacheType, Interaction } from "discord.js";
import type { Event } from "types/events";

const ERROR_REPLY_CONTENT = "There was an error while executing this command!";

export const event: Event = {
  name: "interactionCreate",
  once: false,
  run: async (interaction: Interaction<CacheType>) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.run(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: ERROR_REPLY_CONTENT,
          ephemeral: true
        });
      }
    }
  }
};
