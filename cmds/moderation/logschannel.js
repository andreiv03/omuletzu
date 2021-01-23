const Guild = require('../../models/guild');

module.exports = {
  name: 'logschannel',
  aliases: ['logsch'],
  description: 'Setează canalul unde să fie afișate toate sanctiunile (ban, unban, kick, warn și remove warn). Atentie, nu poti folosi nicio comandă de moderare înainte de a seta canalul!',
  color: '#f55656',
  usage: '<canal>',
  permissions: ['Manage Server'],
  cooldown: 15,
  guildOnly: true,
  async execute(message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (!message.member.hasPermission('MANAGE_GUILD') && !guildSettings.modRoles.some(role => {
      if (message.member.roles.cache.find(r => r.id == role)) return true;
      else return false;
    })) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return message.reply('nu ai mentionat un canal valid!');

    guildSettings.updateOne({
      logsChannelID: channel.id
    }).catch(error => console.error(error));

    return message.channel.send(`Canalul ${channel} a fost setat cu succes!`);
  }
};