const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'userinfo',
  aliases: ['despre'],
  description: 'Afișează informatii despre un membru din acest server.',
  color: '#fcc95e',
  usage: '<membru>',
  id: true,
  cooldown: 5,
  guildOnly: true,
  execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const serverName = message.guild.name;

    let status;
    if (member.user.presence.status == 'online') status = 'Online'
    else if (member.user.presence.status == 'dnd') status = 'Busy'
    else if (member.user.presence.status == 'idle') status = 'Idle'
    else if (member.user.presence.status == 'offline') status = 'Offline'

    const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
    
    const statsEmbed = new Discord.MessageEmbed()
      .setColor('#fcc95e')
      .addField('Detalii generale:', [
        `**Nume:** ${member.user.username}`,
        `**Tag:** #${member.user.discriminator}`,
        `**ID:** ${member.id}`,
        `**Avatar:** [LINK](${member.user.displayAvatarURL({ dynamic: true, size: 512 })})`,
        `**Creare cont:** ${moment(member.user.createdTimestamp).format('LL')}, ${moment(member.user.createdTimestamp).fromNow()}`,
        `\u200b`
      ], true)
      .addField('Activitate:', [
        `**Status:** ${status}`,
        `**Se joacă:** ${member.user.presence.activities[0] || 'N/A'}`,
        `\u200b`
      ], true)
      .addField(`Detalii din server-ul ${serverName}:`, [
        `**Nickname:** ${member.displayName != member.user.username ? member.displayName : 'N/A'}`,
        `**Intrare server:** ${moment(member.joinedTimestamp).format('LL')}, ${moment(member.joinedTimestamp).fromNow()}`,
        `**Roluri [${roles.length}]:** ${roles.length > 0 ? roles.join(', ') : 'N/A'}`,
      ])

    if (member.user.displayAvatarURL()) 
      statsEmbed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }));
    else statsEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

    message.channel.send({ embed: statsEmbed });
  }
};