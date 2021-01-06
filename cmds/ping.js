module.exports = {
  name: 'ping',
  aliases: ['ms'],
  description: `Afișează ping-ul pe care bot-ul îl are în acest moment.`,
  color: '#e8be3f',
  cooldown: 15,
  guildOnly: false,
  execute(message, args, client) {
    message.channel.send('Calculez ping-ul...').then(msg => {
      const ping = msg.createdTimestamp - message.createdTimestamp;
      message.channel.send(`Bot Latency: ${ping}ms\nAPI Latency: ${client.ws.ping}ms`);
    });
  }
}