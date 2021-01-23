const Discord = require('discord.js');
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
      .setDescription(`**${member.user.tag}** este cel mai bătrân membru al acestui server!\n**Creare cont:** ${moment(member.user.createdAt).format('LL')}, ${moment(member.user.createdAt).fromNow()}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`ID MEMBRU: ${member.user.id}`);

    return message.channel.send(oldestEmbed).catch(error => console.error(error));
  }
};