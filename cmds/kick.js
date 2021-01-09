const Discord = require('discord.js');
const Guild = require('../models/guild');

module.exports = {
  name: 'kick',
  description: 'Dă kick unui membru din acest server.',
  color: '#f55656',
  usage: '<membru> <motiv>',
  id: true,
  permissions: ['Kick Members'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
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
    if (!member.kickable) return message.reply('membrul mentionat nu poate primi kick!'); 
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply('nu poti da kick cuiva cu un rol mai mare decât al tău!');

    if (member) {
      let i = 2, reasonText = `${args[1]}`;
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
        .setTitle('Tocmai ai primit kick!')
        .setColor('#f55656')
        .setTimestamp(new Date())
        .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

      if (message.guild.iconURL()) 
        dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
      else dmEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

      message.channel.send(`${member} a primit kick cu succes!`);

      targetMember.kick().then(() => {
        targetMember.send(dmEmbed).catch(() => message.channel.send(`${member} nu a putut fi notificat cu un mesaj în privat.`));

        if (!logsChannel) return;
        else {
          const kickEmbed = new Discord.MessageEmbed()
            .setTitle(`KICK | Cazul ${guildChange.cases + 1}`)
            .setColor('#f55656')
            .setFooter(`ID MEMBRU: ${targetMember.user.id}`)
            .setTimestamp(new Date())
            .setDescription(`**Membru:** ${targetMember.user.username}#${targetMember.user.discriminator}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);
          
          if (targetMember.user.displayAvatarURL()) 
            kickEmbed.setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true, size: 512 }));
          else kickEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

          return logsChannel.send(kickEmbed);
        }
      }).catch(() => message.reply('nu am permisiunile necesare pentru a-i da kick acestui membru!'));
    }
  }
};