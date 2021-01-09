const Discord = require('discord.js');
const Guild = require('../models/guild');

module.exports = {
  name: 'unban',
  description: 'Debanează un membru din acest server.',
  color: '#f55656',
  usage: '<id> <motiv>',
  permissions: ['Ban Members'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  async execute(message, args, client) {
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

    let member;
    if (!args[0]) return message.reply('trebuie să scrii id-ul unui membru banat!');

    try {
      member = await client.users.fetch(args[0]);
    } catch (error) {
      return message.reply('nu ai introdus un ID valid!');
    }

    let i = 2, reasonText = `${args[1]}`;
    while (args[i]) {
      reasonText += ` ${args[i]}`;
      i++;
    }
    if (reasonText == 'undefined') return message.reply('trebuie să introduci un motiv!');

    message.guild.fetchBans().then(async bans => {
      const targetMember = bans.find(ban => ban.user.id === member.id);

      if (targetMember) {
        await guildChange.updateOne({
          cases: guildChange.cases + 1
        }).catch(error => console.error(error));

        message.channel.send(`${member} a fost debanat cu succes!`);

        const unbanEmbed = new Discord.MessageEmbed()
          .setTitle(`UNBAN | Cazul ${guildChange.cases + 1}`)
          .setColor('#f55656')
          .setFooter(`ID MEMBRU: ${targetMember.user.id}`)
          .setTimestamp(new Date())
          .setDescription(`**Membru:** ${targetMember.user.username}#${targetMember.user.discriminator}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.guild.members.cache.get(message.author.id)}`);

        if (targetMember.user.displayAvatarURL()) 
          unbanEmbed.setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true, size: 512 }));
        else unbanEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

        message.guild.members.unban(targetMember.user.id, reasonText).then(() => {
          if (logsChannel) return logsChannel.send(unbanEmbed);
        }).catch(error => console.error(error));
      } else {
        return message.reply('membrul mentionat nu este banat!')
      }
    }).catch(() => message.channel.send('Tocmai a apărut o eroare!'));
  }
};