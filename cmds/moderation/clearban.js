const Discord = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
  name: 'clearban',
  description: 'Banează un membru din acest server și șterge-i mesajele trimise în urmă cu X zile.\nX este o cifră între 0 și 7, cifra 0 înseamnă deloc.',
  color: '#f55656',
  usage: '<membru> <zile> <motiv>',
  id: true,
  permissions: ['Ban Members'],
  cooldown: 3,
  guildOnly: true,
  async execute(message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (!message.member.hasPermission('BAN_MEMBERS') && !guildSettings.modRoles.some(role => {
      if (message.member.roles.cache.find(r => r.id == role)) return true;
      else return false;
    })) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const logsChannel = message.guild.channels.cache.get(guildSettings.logsChannelID);
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildSettings.prefix}logschannel\` înainte de a sanctiona un membru!`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('trebuie să mentionezi un membru!');
    if (member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!'); 
    if (!member.bannable) return message.reply('membrul mentionat nu poate fi banat!'); 
    if (message.author.id == member.user.id) return message.reply('nu te poti bana pe tine însuti!');
    if (message.member.roles.highest.position == member.roles.highest.position) return message.reply('nu poti bana pe cineva cu același rol ca al tău!');
    if (message.member.roles.highest.position < member.roles.highest.position) return message.reply('nu poti bana pe cineva cu un rol mai mare decât al tău!');
    if (guildSettings.modRoles.some(role => {
      if (member.roles.cache.find(r => r.id == role)) return true;
      else return false;
    })) return message.reply('nu poti bana un moderator!');

    args.shift();
    let time = args[0];
    if (isNaN(time)) return message.reply('trebuie să introduci o durată de timp exprimată în zile! (între 0 și 7 zile, 0 însemnând niciun mesaj șters)');
    if (!isNaN(time)) time = parseFloat(args[0]);
    if (time < 0 || time > 7) return message.reply('trebuie să introduci o cifră validă!');

    args.shift();
    let reasonText = args.join(' ');
    if (!reasonText) return message.reply('trebuie să introduci un motiv!');

    await guildSettings.updateOne({
      cases: guildSettings.cases + 1
    }).catch(error => console.error(error));

    const dmEmbed = new Discord.MessageEmbed()
      .setTitle('Tocmai ai fost banat!')
      .setColor('#f55656')
      .setTimestamp(new Date())
      .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.author.tag}`);

    if (message.guild.iconURL()) 
      dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
    else dmEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

    member.send(dmEmbed).catch(() => message.channel.send(`**${member.user.tag}** nu a putut fi notificat cu un mesaj în privat.`));

    member.ban({
      days: time,
      reason: reasonText
    }).then(() => {
      message.channel.send(`**${member.user.tag}** a fost banat cu succes!`);

      const banEmbed = new Discord.MessageEmbed()
        .setTitle(`Ban | Cazul #${guildSettings.cases + 1}`)
        .setColor('#f55656')
        .setFooter(`ID MEMBRU: ${member.user.id}`)
        .setTimestamp(new Date())
        .setDescription(`**Membru banat:** ${member.user.tag}\n**Motiv:** ${reasonText}\n**Mesaje șterse:** ${time == 1 ? time + ' zi' : time + ' zile'}\n**Moderator răspunzător:** ${message.author.tag}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

      return logsChannel.send(banEmbed);
    }).catch(() => message.reply('nu am permisiunile necesare pentru a bana acest membru!'));
  }
};