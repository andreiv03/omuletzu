const Guild = require('../models/guild');

module.exports = {
  name: 'logschannel',
  aliases: ['logsch'],
  description: 'Setează canalul unde să fie afișate toate sanctiunile (ban, unban, kick, warn și mute). Atentie, nu poti folosi nicio comandă de moderare înainte de a seta canalul!',
  color: '#f55656',
  usage: '<canal>',
  permissions: ['Manage Server'],
  cooldown: 5,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return message.reply('nu ai mentionat un canal valid!');

    await Guild.findOne({
      guildID: message.guild.id
    }, (error, guild) => {
      if (error) console.error(error);

      guild.updateOne({
        logsChannelID: channel.id
      }).catch(error => console.error(error));

      return message.channel.send(`Canalul ${channel} a fost setat cu succes!`);
    });
  }
};