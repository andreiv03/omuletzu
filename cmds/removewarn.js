const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild');
const User = require('../models/user');

module.exports = {
  name: 'removewarn',
  aliases: ['rwarn'],
  description: 'Scoate un warn de la membru din acest server. Trebuie să scrii cazul warn-ului pe care îl găsești cu comanda `warns` pe membrul respectiv! Poti folosi `all` pentru a scoate toate warn-urile deodată.',
  color: '#f55656',
  usage: '<membru> <caz>',
  id: true,
  permissions: ['Manage Server'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');
    
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    const logsChannel = message.guild.channels.cache.get(guildSettings.logsChannelID);
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildSettings.prefix}logschannel\` înainte de a sanctiona un membru!`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply('trebuie să mentionezi un membru!');
    if (member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!');

    if (args[1].toLowerCase() != 'all')
      if (!args[1] || isNaN(args[1])) return message.reply('nu ai introdus un caz valid!');

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
          .setTitle(`REMOVE WARN | CAZUL #${guildSettings.cases + 1}`)
          .setColor('#f55656')
          .setFooter(`ID MEMBRU: ${member.user.id}`)
          .setTimestamp(new Date())
          .setDescription(`**Membru:** ${member.user.tag}\n**Moderator răspunzător:** ${message.author.tag}`);

        if (member.user.displayAvatarURL()) 
          warnEmbed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
        else warnEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

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
        .setTitle(`REMOVE WARN | CAZUL #${guildSettings.cases + 1}`)
        .setColor('#f55656')
        .setFooter(`ID MEMBRU: ${member.user.id}`)
        .setTimestamp(new Date())
        .setDescription(`**Membru:** ${member.user.tag}\n**Moderator răspunzător:** ${message.author.tag}`);

      if (member.user.displayAvatarURL()) 
        warnEmbed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
      else warnEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

      return logsChannel.send(warnEmbed);
    }
  }
};