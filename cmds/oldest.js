const Discord = require("discord.js");
const moment = require('moment');

module.exports = {
  name: 'oldest',
  description: 'Află care este cel mai bătrân membru al acestui server, în functie de creerea contului.',
  color: '#fcc95e',
  cooldown: 10,
  guildOnly: true,
  execute(message) {
    const member = message.guild.members.cache.filter(m => !m.user.bot).sort((a, b) => a.user.createdAt - b.user.createdAt).first();

    const oldestEmbed = new Discord.MessageEmbed()
      .setColor('#fcc95e')
      .setTitle(`${moment(member.user.createdAt).format('LLLL')}`)
      .setDescription(`${member} este cel mai bătrân membru al acestui server!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    if (message.guild.iconURL()) 
      oldestEmbed.setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
    else oldestEmbed.attachFiles(['./imgs/discord-logo.png']).setFooter(`${message.guild.name}`, 'attachment://discord-logo.png');

    return message.channel.send(oldestEmbed).catch(error => console.error(error));
  }
};