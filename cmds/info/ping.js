const Discord = require('discord.js');

module.exports = {
  name: 'ping',
  aliases: ['ms'],
  description: `Afișează ping-ul pe care îl are Omuletzu' în acest moment.`,
  color: '#fcc95e',
  cooldown: 15,
  guildOnly: false,
  async execute(message, args, client) {
    const pingEmbed = new Discord.MessageEmbed()
      .setColor('#fcc95e')
      .setTitle('Calculez ping-ul...');
      
    const msg = await message.channel.send(pingEmbed);

    pingEmbed.setColor('#fcc95e')
      .setTitle('Ping calculat!')
      .setDescription(`**Bot Latency:** ${Math.floor(msg.createdTimestamp - message.createdTimestamp)} ms \n**API Latency:** ${Math.round(client.ws.ping)} ms`);

    return msg.edit(pingEmbed);
  }
}