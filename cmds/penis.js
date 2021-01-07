const Discord = require("discord.js");

module.exports = {
  name: 'penis',
  aliases: ['pp'],
  description: 'Cât de mare ai penisul?',
  color: '#f0549d',
  usage: '<membru>',
  id: true,
  cooldown: 3,
  guildOnly: true,
  execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let cm = Math.floor(Math.random() * 26), cmCopy = cm;
    let width = '8', reply;
    if (cmCopy == 0) reply = `Coaie... Ăsta nu e penis!\n${member}, ai `
    else if (cmCopy < 13) reply = `Se putea și mai bine...\n${member}, ai `;
    else if (cmCopy >= 13 && cmCopy <= 18) reply = `Bravo, frate!\n${member}, ai `;
    else reply = `Mai ușor, africanule!!!\n${member}, ai `;

    while (cm) {
      width = width + '=';
      cm--;
    }
    width += 'D';

    const penisEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`Cât de mare ai penisul?`)
      .setDescription(`${reply}${cmCopy >= 20 ? cmCopy + ' de': cmCopy} cm. :banana:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter(`${width}`)

    message.channel.send(penisEmbed).catch(error => console.error('Error: ', error));
  }
};