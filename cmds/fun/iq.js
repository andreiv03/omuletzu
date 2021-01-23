const Discord = require('discord.js');

module.exports = {
  name: 'iq',
  aliases: ['whatiq'],
  description: 'Cât de mare ai IQ-ul?',
  color: '#f0549d',
  usage: '<membru>',
  id: true,
  cooldown: 3,
  guildOnly: true,
  execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let number = Math.floor(Math.random() * 251);

    const iqEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Cât de mare ai IQ-ul?')
      .setDescription(`**${member.user.tag}** are ${number} IQ! :brain:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`ID MEMBRU: ${member.user.id}`);

    message.channel.send(iqEmbed).catch(error => console.error(error));
  }
};