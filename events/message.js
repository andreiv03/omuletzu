const Discord = require('discord.js');
const { prefix } = require('../config.json');
const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Get command's name and args

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Find the command

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  // GuildOnly property

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('Nu pot executa această comandă în DM-uri!');
  }

  // Command usage

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

  // Execute the command

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('a apărut o eroare la rularea acestei comenzi. Mai încearcă o dată!');
  }
};