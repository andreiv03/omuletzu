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

// Get all commands

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./cmds/${file}`);
  client.commands.set(command.name, command);
}

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







// Games

  /*if (message.channel.type !== 'dm') {
    if (message.content.toLowerCase() === `${prefix}guess` || message.content.toLowerCase() === `${prefix}ghiceste`) 
      guessGame.newGame(message, message.member);
    if (message.content.toLowerCase() === `${prefix}hangman` || message.content.toLowerCase() === `${prefix}spanzuratoarea`) 
      hangmanGame.newGame(message, message.member);
  }*/



  // Games

/*const GuessGame = require('./cmds/guess-game.js');
const guessGame = new GuessGame(client);
const HangmanGame = require('./cmds/hangman-game.js');
const hangmanGame = new HangmanGame(client);*/