module.exports = {
  name: 'invite',
  description: `Afișează un link pentru a-l invita pe Omuletzu' pe server-ul tău.`,
  color: '#e8be3f',
  cooldown: 15,
  guildOnly: false,
  execute(message) {
    return message.channel.send('<https://discord.com/api/oauth2/authorize?client_id=747112444253700147&permissions=8&scope=bot>');
  }
};