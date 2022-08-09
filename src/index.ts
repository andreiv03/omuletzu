import { Client, GatewayIntentBits } from "discord.js";
import { SECRET_TOKEN } from "./constants";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log("Omuletzu' is online.");
});

client.login(SECRET_TOKEN);