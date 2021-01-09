const Discord = require('discord.js');
const Guild = require('../models/guild');

module.exports = {
  name: 'clearban',
  description: 'Banează un membru din acest server și șterge-i mesajele trimise până acum X zile. (X este o cifră între 0 și 7, 0 însemnând deloc)',
  aliases: ['deleteban'],
  color: '#f55656',
  usage: '<membru> <zile> <motiv>',
  id: true,
  permissions: ['Ban Members'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');
    }

    const guildChange = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    const logsChannel = message.guild.channels.cache.get(guildChange.logsChannelID);
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildChange.prefix}logschannel\``);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('trebuie să mentionezi un membru!');
    if (member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!'); 
    if (!member.bannable) return message.reply('membrul mentionat nu poate fi banat!'); 
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply('nu poti bana pe cineva cu un rol mai mare decât al tău!');

    if (member) {
      let time = args[1];
      if (isNaN(time)) return message.reply('trebuie să introduci o durată de timp exprimată în zile! (între 0 și 7 zile, 0 însemnând deloc)');
      if (!isNaN(time)) time = parseFloat(args[1]);

      let i = 3, reasonText = `${args[2]}`;
      while (args[i]) {
        reasonText += ` ${args[i]}`;
        i++;
      }
      if (reasonText == 'undefined') return message.reply('trebuie să introduci un motiv!');

      await guildChange.updateOne({
        cases: guildChange.cases + 1
      }).catch(error => console.error(error));

      const targetMember = message.guild.members.cache.get(member.id);
      const dmEmbed = new Discord.MessageEmbed()
        .setTitle('Tocmai ai fost banat!')
        .setColor('#f55656')
        .setTimestamp(new Date())
        .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

      if (message.guild.iconURL()) 
        dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
      else dmEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

      message.channel.send(`${member} a fost banat cu succes!`);

      targetMember.ban({
        days: time,
        reason: reasonText
      }).then(() => {
        targetMember.send(dmEmbed).catch(() => message.channel.send(`${member} nu a putut fi notificat cu un mesaj în privat.`));

        if (!logsChannel) return;
        else {
          const banEmbed = new Discord.MessageEmbed()
            .setTitle(`BAN | Cazul ${guildChange.cases + 1}`)
            .setColor('#f55656')
            .setFooter(`ID MEMBRU: ${targetMember.user.id}`)
            .setTimestamp(new Date())
            .setDescription(`**Membru banat:** ${targetMember.user.username}#${targetMember.user.discriminator}\n**Motiv:** ${reasonText}\n**Mesaje șterse:** ${time == 1 ? time + ' zi' : time + ' zile'}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

          if (targetMember.user.displayAvatarURL()) 
            banEmbed.setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true, size: 512 }));
          else banEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

          return logsChannel.send(banEmbed);
        }
      }).catch(() => message.reply('nu am permisiunile necesare pentru a bana acest membru!'));
    }
  }
};