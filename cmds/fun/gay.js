const Discord = require('discord.js');

module.exports = {
  name: 'gay',
  aliases: ['howgay'],
  description: 'Cât la sută ești gay?',
  color: '#f0549d',
  usage: '<membru>',
  id: true,
  cooldown: 3,
  guildOnly: true,
  execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let percent = Math.floor(Math.random() * 101);

    const gayEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Cât la sută ești gay?')
      .setDescription(`**${member.user.tag}** este ${percent}% gay! :rainbow_flag:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`ID MEMBRU: ${member.user.id}`);

    message.channel.send(gayEmbed).catch(error => console.error(error));
  }
};