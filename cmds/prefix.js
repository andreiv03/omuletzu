const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = {
  name: 'prefix',
  description: 'Schimbă prefixul bot-ului pentru acest server.',
  color: '#f55656',
  usage: '<noul prefix>',
  permissions: ['Manage Server'],
  cooldown: 15,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD'))
      return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const settings = await Guild.findOne({
      guildID: message.guild.id
    }, (error, guild) => {
      if (error) console.error(error);
      if (!guild) {
        const newGuild = new Guild({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          guildName: message.guild.name,
          prefix: process.env.PREFIX
        });

        newGuild.save().then(result => console.log(result)).catch(error => console.error(error));
        return message.reply('acest server nu era adăugat în baza mea de date. Scrie din nou comanda!');
      }
    });

    if (!args[0])
      return message.reply(`trebuie să specifici noul prefix! Prefix-ul este momentan \`${settings.prefix}\``);
    
    await settings.updateOne({
      prefix: args[0]
    });

    return message.channel.send(`Comanda a fost executată cu succes!\nNoul prefix al bot-ului <@747112444253700147> este \`${args[0]}\``);
  }
};