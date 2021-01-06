const Discord = require("discord.js");
const canva = require('canvacord')

module.exports = {
  name: 'trigger',
  description: 'Folosește efectul TRIGGERED pe cineva.',
  color: '#f0549d',
  usage: '<membru>',
  id: true,
  cooldown: 5,
  async execute(message, args) {
    let member;
    if (message.mentions.members.first())
      member = message.mentions.members.first().user;
    else if (message.guild.members.cache.get(args[0]))
      member = message.guild.members.cache.get(args[0]).user
    else member = message.author;

    const avatar = member.displayAvatarURL({ dynamic: false, format: "png" });

    const image = await canva.Canvas.trigger(avatar);
    const triggered = new Discord.MessageAttachment(image, 'triggered.gif');
    
    return message.channel.send(triggered);
  }
};