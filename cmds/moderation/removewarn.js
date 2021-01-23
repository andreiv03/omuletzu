const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
const User = require('../../models/user');

module.exports = {
  name: 'removewarn',
  aliases: ['rwarn'],
  description: 'Scoate un warn de la membru din acest server.\nTrebuie să scrii cazul warn-ului pe care îl găsești cu comanda `warns` pe membrul respectiv! Folosește `all` pentru a scoate toate warn-urile deodată.',
  color: '#f55656',
  usage: '<membru> <caz>',
  id: true,
  permissions: ['Manage Server'],
  cooldown: 3,
  guildOnly: true,
  async execute(message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (!message.member.hasPermission('MANAGE_GUILD') && !guildSettings.modRoles.some(role => {
      if (message.member.roles.cache.find(r => r.id == role)) return true;
      else return false;
    })) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const logsChannel = message.guild.channels.cache.get(guildSettings.logsChannelID);
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildSettings.prefix}logschannel\` înainte de a sanctiona un membru!`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('trebuie să mentionezi un membru!');
    if (member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!');
    if (message.author.id == member.user.id) return message.reply('nu îti poti scoate warn-urile tale!');
    if (message.member.roles.highest.position == member.roles.highest.position) return message.reply('nu poti scoate warn-uri de la un membru cu același rol ca al tău!');
    if (message.member.roles.highest.position < member.roles.highest.position) return message.reply('nu poti scoate warn-uri de la un membru cu un rol mai mare decât al tău!');

    if (!args[1]) return message.reply('nu ai introdus un caz valid!');
    if (args[1].toLowerCase() != 'all')
      if (isNaN(args[1])) return message.reply('nu ai introdus un caz valid!');

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
          warns: [],
          guessGame: 0,
          hangmanGame: 0
        });

        await newUser.save().catch(error => console.error(error));
      }
    });

    if (args[1].toLowerCase() != 'all') {
      let warnings = userSettings.warns, ok = false;
      for (let i = 0; i < warnings.length; i++) {
        if (warnings[i].caseNr == args[1]) {
          warnings.splice(i, 1);
          ok = true;
          break;
        }
      }

      if (ok) {
        await guildSettings.updateOne({
          cases: guildSettings.cases + 1
        }).catch(error => console.error(error));

        await userSettings.updateOne({
          warns: warnings
        }).catch(error => console.error(error));

        message.channel.send(`Warn-ul cu cazul **#${args[1]}** a fost scos cu succes!`);

        const warnEmbed = new Discord.MessageEmbed()
          .setTitle(`Remove Warn | Cazul #${guildSettings.cases + 1}`)
          .setColor('#f55656')
          .setFooter(`ID MEMBRU: ${member.user.id}`)
          .setTimestamp(new Date())
          .setDescription(`**Membru:** ${member.user.tag}\n**Moderator răspunzător:** ${message.author.tag}`)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

        return logsChannel.send(warnEmbed);
      } else {
        return message.reply(`membrul mentionat nu detine warn-ul cu cazul **#${args[1]}**!`)
      }
    } else {
      await guildSettings.updateOne({
        cases: guildSettings.cases + 1
      }).catch(error => console.error(error));

      await userSettings.updateOne({
        warns: []
      }).catch(error => console.error(error));

      message.channel.send(`Toate warn-urile lui **${member.user.tag}** au fost scoase cu succes!`);

      const warnEmbed = new Discord.MessageEmbed()
        .setTitle(`Remove Warn | Cazul #${guildSettings.cases + 1}`)
        .setColor('#f55656')
        .setFooter(`ID MEMBRU: ${member.user.id}`)
        .setTimestamp(new Date())
        .setDescription(`**Membru:** ${member.user.tag}\n**Moderator răspunzător:** ${message.author.tag}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

      return logsChannel.send(warnEmbed);
    }
  }
};