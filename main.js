const Discord = require('discord.js');
const fs = require('fs');

// Config file

const { config } = require('dotenv');

config({
  path: `${__dirname}/.env`
});

// The client

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.mongoose = require('./utils/mongoose.js');

// Get the commands

fs.readdirSync('./cmds').forEach(dir => {
  const commandfiles = fs.readdirSync(`./cmds/${dir}`).filter(file => file.endsWith('.js'));
  for (const file of commandfiles) {
    const command = require(`./cmds/${dir}/${file}`);
    client.commands.set(command.name, command);
  }
});

// Giveaways

const { GiveawaysManager } = require('discord-giveaways') 
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
      botsCanWin: false,
      exemptPermissions: [],
      embedColor: "#fcc95e",
      embedColorEnd: "#fcc95e",
      reaction: "🎉"
  }
});

// Unhandled promise rejections

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

// Execute the events

fs.readdir('./events/', (error, files) => {
  if (error) return console.error;

  files.forEach(file => {
      if (!file.endsWith('.js')) return;
      const event = require(`./events/${file}`);
      const eventName = file.split('.')[0];
      client.on(eventName, event.bind(null, client));
  });
});

// Login

client.mongoose.init();
client.login(process.env.TOKEN);