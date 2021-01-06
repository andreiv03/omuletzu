const Discord = require('discord.js');
const fs = require('fs');
let { prefix, token } = require('./config.json');
let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', 'utf8'));

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();


const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./cmds/${file}`);
  client.commands.set(command.name, command);
}

// Games

const GuessGame = require('./cmds/guess-game.js');
const guessGame = new GuessGame(client);
const HangmanGame = require('./cmds/hangman-game.js');
const hangmanGame = new HangmanGame(client);

//

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});


client.once('ready', () => {
  let status = `${prefix}help | ${prefix}invite | ${client.guilds.cache.size} servers`;
  client.user.setActivity(status, { type: 'PLAYING' });
  console.log(`Omuletzu\' is online in ${client.guilds.cache.size} servers!`);
});


client.on('guildCreate', function(guild) {
  if (!prefixes[guild.id]) {
    prefixes[guild.id] = {
      prefixes: prefix
    };
  }
  fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (error) => {
    if (error) console.log(error);
  });
});


client.on('message', async message => {
  if (message.channel.type !== 'dm') {
    prefixes = JSON.parse(fs.readFileSync('./prefixes.json', 'utf8'));
    if (!prefixes[message.guild.id]) {
      prefixes[message.guild.id] = {
        prefixes: prefix
      };
    }
    prefix = prefixes[message.guild.id].prefixes;
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Games

  if (message.channel.type !== 'dm') {
    if (message.content.toLowerCase() === `${prefix}guess` || message.content.toLowerCase() === `${prefix}ghiceste`) 
      guessGame.newGame(message, message.member);
    if (message.content.toLowerCase() === `${prefix}hangman` || message.content.toLowerCase() === `${prefix}spanzuratoarea`) 
      hangmanGame.newGame(message, message.member);
  }

  //

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('Nu pot executa această comandă în DM-uri!');
  }

  if (command.args && !args.length) {
    let reply = `Comanda este incompletă, ${message.author}!`;
    if (command.usage) {
      reply += `\nModul corect de folosire al comenzii este \`${prefix}${command.name} ${command.usage}\`.`;
    }
    return message.channel.send(reply);
  }

  // Cooldowns

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`trebuie să mai aștepti ${timeLeft.toFixed(2)} secunde pentru a folosi comanda \`${command.name}\`.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('a apărut o eroare la rularea acestei comenzi. Mai încearcă o dată!');
  }
});


client.login(process.env.token);