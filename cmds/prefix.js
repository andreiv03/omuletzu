const Guild = require('../models/guild');

module.exports = {
  name: 'prefix',
  description: 'Schimbă prefixul bot-ului pentru acest server.',
  color: '#f55656',
  usage: '<noul prefix>',
  permissions: ['Manage Server'],
  cooldown: 15,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const settings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (!args[0]) return message.reply(`trebuie să specifici noul prefix! Prefixul actual este \`${settings.prefix}\` și nu poti să-l setezi pe același!`);
    if (args[0] == settings.prefix) return message.reply(`trebuie să alegi un prefix diferit!`);

    await settings.updateOne({
      prefix: args[0]
    }).catch(error => console.error(error));

    return message.channel.send(`Comanda a fost executată cu succes!\nNoul prefix al bot-ului <@747112444253700147> este \`${args[0]}\``);
  }
};