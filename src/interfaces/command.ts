import type { Interaction } from "discord.js";
import type { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: Interaction) => Promise<void>;
};