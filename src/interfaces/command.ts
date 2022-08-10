import type { Interaction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: Interaction) => Promise<void>;
};