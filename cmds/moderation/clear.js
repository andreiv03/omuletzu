const Guild = require('../../models/guild');

module.exports = {
  name: 'clear',
  aliases: ['delete'],
  description: 'Șterge un număr de mesaje.',
  color: '#f55656',
  usage: '<număr de mesaje>',
  permissions: ['Manage Messages'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (!message.member.hasPermission('MANAGE_MESSAGES') && !guildSettings.modRoles.some(role => {
      if (message.member.roles.cache.find(r => r.id == role)) return true;
      else return false;
    })) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount) || amount <= 1) {
      return message.reply('nu ai introdus un număr valid!');
    } else if (amount > 100) {
      return message.reply('poti șterge maxim 99 de mesaje deodată!');
    }

    await message.channel.bulkDelete(amount, true).catch(error => {
      console.error(error);
      message.channel.send('Tocmai a apărut o eroare la rularea acestei comenzi. Mai încearcă o dată!');
    });
  }
};