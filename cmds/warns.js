const Discord = require('discord.js');
const User = require('../models/user');

module.exports = {
  name: 'warns',
  description: 'Afișează warn-urile unui membru din acest server.',
  color: '#f55656',
  usage: '<membru>',
  id: true,
  permissions: ['Manage Server'],
  cooldown: 5,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (member && member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!');

    if (member) {
      const userWarnings = await User.findOne({
        guildID: message.guild.id,
        userID: member.id
      }, (error) => {
        if (error) console.error(error);
      });

      if (!userWarnings) return message.reply('membrul mentionat nu are niciun warn!');
      if (!userWarnings.warns.length) return message.reply('membrul mentionat nu are niciun warn!');

      let title = `${member.user.tag} are ${userWarnings.warns.length == 1 ? userWarnings.warns.length + ' warn' : userWarnings.warns.length + ' warn-uri'} în server-ul ${message.guild.name}`;

      const warnsEmbed = new Discord.MessageEmbed()
        .setTitle(`${title}`)
        .setColor('#f55656')
        .setFooter(`ID MEMBRU: ${member.id}`);

      for (const warning of userWarnings.warns) {
        const { author, timestamp, reason, caseNr } = warning;
        warnsEmbed.addField(`CAZUL #${caseNr} | ${timestamp.toLocaleString()}`, [
          `**Moderator răspunzător: ** ${author}`,
          `**Motiv: ** ${reason}`
        ], false);
      }

      return message.channel.send(warnsEmbed);
    } else {
      let theDescription = ``, k = 0;

      await User.find({
        guildID: message.guild.id,
      }, async (error, users) => {
        if (error) console.error(error);

        users.sort((a, b) => b.warns.length - a.warns.length).map(user => {
          if (user.warns && user.warns.length > 0) {
            k = k + 1;
            if (k == 15) return;
            const theMember = message.guild.members.cache.get(user.userID);
            theDescription += `**${theMember.user.tag}:** ${user.warns.length == 1 ? user.warns.length + ' warn' : user.warns.length + ' warn-uri'}\n`;
          }
        });
      });

      if (k) {
        const warnsEmbed = new Discord.MessageEmbed()
          .setTitle(`Warn-urile din server-ul ${message.guild.name}`)
          .setColor('#f55656')
          .setFooter('Vor fi afișati primii 15 membri în funcție de câte warn-uri au.')
          .setDescription(`${theDescription}`);

        return message.channel.send(warnsEmbed);
      } else {
        return message.channel.send(`Nu există niciun warn în acest server!`);
      }
    }
  }
};