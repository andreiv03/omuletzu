const Discord = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Banează un membru din acest server.',
  color: '#f55656',
  usage: '<membru> <motiv>',
  id: true,
  permissions: ['Ban Members'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  execute(message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');
    }
    else {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.reply('trebuie să mentionezi un membru!');
      if (member.user.bot) return message.reply('nu poti folosi această comandă pe un bot!'); 
      if (member) {
        let i = 2, reasonText = `${args[1]}`;
        while (args[i]) {
          reasonText += ` ${args[i]}`;
          i++;
        }
        if (reasonText == 'undefined') return message.reply('trebuie să introduci un motiv!');

        const targetMember = message.guild.members.cache.get(member.id);
        const dmEmbed = new Discord.MessageEmbed()
          .setTitle('Tocmai ai fost banat!')
          .setColor('#f55656')
          .setTimestamp(new Date())
          .setDescription(`**Server:** ${message.guild.name}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

        if (message.guild.iconURL()) 
          dmEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
        else dmEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

        targetMember.ban({
          days: 0,
          reason: reasonText
        }).then(() => {
          targetMember.send(dmEmbed).catch(() => message.channel.send('Acest membru nu a putut fi notificat cu un mesaj în privat.'));
          
          const banEmbed = new Discord.MessageEmbed()
            .setTitle('Ban executat cu succes!')
            .setColor('#f55656')
            .setTimestamp(new Date())
            .setDescription(`**Membru banat:** ${targetMember}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

          if (targetMember.user.displayAvatarURL()) 
            banEmbed.setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true, size: 512 }));
          else banEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

          return message.channel.send(banEmbed);
        }).catch(() => message.reply('nu am permisiunile necesare pentru a bana acest membru!'));
      }
    }
  }
};