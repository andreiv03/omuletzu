const Discord = require("discord.js");

module.exports = {
  name: 'tall',
  aliases: ['howtall'],
  description: 'Cât de înalt ești?',
  color: '#f0549d',
  usage: '<membru>',
  id: true,
  cooldown: 3,
  guildOnly: true,
  execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let number = Math.random() * 1 + 1;

    const tallEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Cât de înalt ești?')
      .setDescription(`${member} are ${number.toFixed(2)} metri! :ladder:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))

    message.channel.send(tallEmbed).catch(error => console.error('Error: ', error));
  }
};