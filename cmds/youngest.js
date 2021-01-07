const Discord = require("discord.js");
const moment = require('moment');

module.exports = {
  name: 'youngest',
  description: 'Află care este cel mai tânăr membru al acestui server!',
  color: '#fcc95e',
  cooldown: 5,
  guildOnly: true,
  execute(message) {
    const member = message.guild.members.cache.filter(m => !m.user.bot).sort((a, b) => b.user.createdAt - a.user.createdAt).first();

    const oldestEmbed = new Discord.MessageEmbed()
      .setColor('#fcc95e')
      .setTitle(`${moment(member.user.createdAt).format('LLLL')}`)
      .setDescription(`**${member.user.username}#${member.user.discriminator}** este cel mai tânăr membru al acestui server!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))

    if (message.guild.iconURL()) 
      oldestEmbed.setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
    else oldestEmbed.attachFiles(['./imgs/discord-logo.png']).setFooter(`${message.guild.name}`, 'attachment://discord-logo.png');

    message.channel.send(oldestEmbed).catch(error => console.error('Error: ', error));
  }
};