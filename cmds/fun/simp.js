const Discord = require('discord.js');

module.exports = {
  name: 'simp',
  aliases: ['howsimp'],
  description: 'Cât la sută ești simp?',
  color: '#f0549d',
  usage: '<membru>',
  id: true,
  cooldown: 3,
  guildOnly: true,
  execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let percent = Math.floor(Math.random() * 101);

    const simpEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Cât la sută ești simp?')
      .setDescription(`**${member.user.tag}** este ${percent}% simp! :clown:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`ID MEMBRU: ${member.user.id}`);

    message.channel.send(simpEmbed).catch(error => console.error(error));
  }
};