const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild');
const User = require('../models/user');

module.exports = {
  name: 'warn',
  description: 'Dă warn unui membru din acest server.',
  color: '#f55656',
  usage: '<membru> <motiv>',
  id: true,
  permissions: ['Manage Server'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');
    
    let guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    const logsChannel = message.guild.channels.cache.get(guildSettings.logsChannelID);
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildSettings.prefix}logschannel\` înainte de a sanctiona un membru!`);

    const maxWarns = guildSettings.maxWarns;

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('trebuie să mentionezi un membru!');
    if (member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!');
    if (message.author.id == member.user.id) return message.reply('nu îti poti da warn tie însuti!');
    if (message.member.roles.highest.position == member.roles.highest.position) return message.reply('nu poti da warn unui membru cu același rol ca al tău!');
    if (message.member.roles.highest.position < member.roles.highest.position) return message.reply('nu poti da warn unui membru cu un rol mai mare decât al tău!');

    args.shift();
    let reasonText = args.join(' ');
    if (!reasonText) return message.reply('trebuie să introduci un motiv!');

    const warning = {
      author: message.member.user.tag,
      timestamp: new Date().toLocaleString(),
      reason: reasonText,
      caseNr: guildSettings.cases + 1
    };

    await guildSettings.updateOne({
      cases: guildSettings.cases + 1
    }).catch(error => console.error(error));

    const userSettings = await User.findOne({
      guildID: message.guild.id,
      userID: member.id
    }, async (error, user) => {
      if (error) console.error(error);

      if (!user) {
        const newUser = new User({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          userID: member.id,
          warns: [warning],
          guessGame: 0,
          hangmanGame: 0
        });

        await newUser.save().catch(error => console.error(error));
      } else {
        user.updateOne({
          $push: {
            warns: warning
          }
        }).catch(error => console.error(error));
      }
    });

    const dmEmbed = new Discord.MessageEmbed()
      .setTitle('Tocmai ai primit un warn!')
      .setColor('#f55656')
      .setTimestamp(new Date())
      .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.author.tag}`);

    if (message.guild.iconURL()) 
      dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
    else dmEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

    member.send(dmEmbed).catch(() => message.channel.send(`**${member.user.tag}** nu a putut fi notificat cu un mesaj în privat.`));

    const warnEmbed = new Discord.MessageEmbed()
      .setTitle(`WARN | CAZUL #${guildSettings.cases + 1}`)
      .setColor('#f55656')
      .setFooter(`ID MEMBRU: ${member.user.id}`)
      .setTimestamp(new Date())
      .setDescription(`**Membru:** ${member.user.tag}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.author.tag}`);

    if (member.user.displayAvatarURL()) 
      warnEmbed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
    else warnEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

    if (userSettings && userSettings.warns.length == 0) message.channel.send(`**${member.user.tag}** a primit primul lui warn!`);
    else message.channel.send(`**${member.user.tag}** a primit un warn!`);

    if (userSettings && userSettings.warns.length >= maxWarns - 1) {
      guildSettings = await Guild.findOne({
        guildID: message.guild.id
      }, (error) => {
        if (error) console.error(error);
      });

      await guildSettings.updateOne({
        cases: guildSettings.cases + 1
      }).catch(error => console.error(error));

      await userSettings.updateOne({
        warns: []
      }).catch(error => console.error(error));

      const dmEmbed2 = new Discord.MessageEmbed()
        .setTitle('Tocmai ai fost banat!')
        .setColor('#f55656')
        .setTimestamp(new Date())
        .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${maxWarns}/${maxWarns} warn-uri`);

      if (message.guild.iconURL()) 
        dmEmbed2.setThumbnail(message.guild.iconURL({ dynamic: true }));
      else dmEmbed2.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

      member.send(dmEmbed2).catch(() => message.channel.send(`**${member.user.tag}** nu a putut fi notificat cu un mesaj în privat în legătură cu ban-ul.`));

      member.ban({
        days: 0,
        reason: `${maxWarns}/${maxWarns} warn-uri`
      }).then(() => {
        message.channel.send(`**${member.user.tag}** a fost banat deoarece a acumulat ${maxWarns}/${maxWarns} warn-uri!`);

        const banEmbed = new Discord.MessageEmbed()
          .setTitle(`BAN | CAZUL #${guildSettings.cases + 1}`)
          .setColor('#f55656')
          .setFooter(`ID MEMBRU: ${member.user.id}`)
          .setTimestamp(new Date())
          .setDescription(`**Membru:** ${member.user.tag}\n**Motiv:** ${maxWarns}/${maxWarns} warn-uri`);

        if (member.user.displayAvatarURL()) 
          banEmbed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
        else banEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

        logsChannel.send(warnEmbed);
        return logsChannel.send(banEmbed);
      }).catch(() => message.reply(`nu am permisiunile necesare pentru a bana acest membru! Motiv: ${maxWarns}/${maxWarns} warn-uri.`));
    } else return logsChannel.send(warnEmbed);
  }
};