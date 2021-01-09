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
    if (!message.member.hasPermission('MANAGE_GUILD')) {
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
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply('nu poti da warn cuiva cu un rol mai mare decât al tău!');

    if (member) {
      let i = 2, reasonText = `${args[1]}`;
      while (args[i]) {
        reasonText += ` ${args[i]}`;
        i++;
      }
      if (reasonText == 'undefined') return message.reply('trebuie să introduci un motiv!');

      const warning = {
        author: message.member.user.tag,
        timestamp: new Date().getTime(),
        reason: reasonText
      };

      await guildChange.updateOne({
        cases: guildChange.cases + 1
      }).catch(error => console.error(error));

      await User.findOne({
        guildID: message.guild.id,
        userID: member.id
      }, async (error, user) => {
        if (error) console.error(error);
  
        if (!user) {
          const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            userID: member.id,
            $push: {
              warns: warning
            },
            mute: null
          });
  
          await newUser.save().catch(error => console.error(error));
        } else {
          user.updateOne({
            $push: {
              warns: warning
            }
          }).catch(error => console.error(error));
        };
      });

      const targetMember = message.guild.members.cache.get(member.id);
      const dmEmbed = new Discord.MessageEmbed()
        .setTitle('Tocmai ai primit un warn!')
        .setColor('#f55656')
        .setTimestamp(new Date())
        .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

      if (message.guild.iconURL()) 
        dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
      else dmEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

      message.channel.send(`${member} a primit un warn!`);

      const warnEmbed = new Discord.MessageEmbed()
        .setTitle(`warn | Cazul ${guildChange.cases + 1}`)
        .setColor('#f55656')
        .setFooter(`ID MEMBRU: ${targetMember.user.id}`)
        .setTimestamp(new Date())
        .setDescription(`**Membru:** ${targetMember.user.username}#${targetMember.user.discriminator}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

      if (targetMember.user.displayAvatarURL()) 
        warnEmbed.setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true, size: 512 }));
      else warnEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

      return logsChannel.send(warnEmbed);
    }
  }
};