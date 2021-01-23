const Guild = require('../../models/guild');

module.exports = {
  name: 'maxwarns',
  description: 'Setează la câte warn-uri (între 3 și 10) să se dea ban automat unui membru. Initial, comanda este setată la 10 warn-uri.',
  color: '#f55656',
  usage: '<număr>',
  permissions: ['Manage Server'],
  cooldown: 5,
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

    if (!args[0]) return message.reply(`trebuie să introduci un număr valid cuprins între 3 și 10! Maximul actual este de \`${settings.maxWarns}\` warn-uri.`);
    if (isNaN(args[0])) return message.reply(`trebuie să introduci un număr valid cuprins între 3 și 10! Maximul actual este de \`${settings.maxWarns}\` warn-uri.`);
    if (args[0] < 3 || args[0] > 10) return message.reply(`trebuie să introduci un număr valid cuprins între 3 și 10! Maximul actual este de \`${settings.maxWarns}\` warn-uri.`);

    await guildSettings.updateOne({
      maxWarns: args[0]
    }).catch(error => console.error(error));

    return message.channel.send(`Comanda a fost executată cu succes!\nMembrii acestui server vor primi ban automat când vor strânge \`${args[0]}\` warn-uri.`);
  }
};