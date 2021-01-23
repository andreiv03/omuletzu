const Discord = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
  name: 'unban',
  description: 'Debanează un membru din acest server.',
  color: '#f55656',
  usage: '<id> <motiv>',
  permissions: ['Ban Members'],
  cooldown: 3,
  guildOnly: true,
  async execute(message, args, client) {
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
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildSettings.prefix}logschannel\` înainte de a debana un membru!`);

    let member;
    if (!args[0]) return message.reply('trebuie să scrii id-ul unui membru banat!');

    try {
      member = await client.users.fetch(args[0]);
    } catch (error) {
      return message.reply('nu ai introdus un ID valid!');
    }

    args.shift();
    let reasonText = args.join(' ');
    if (!reasonText) return message.reply('trebuie să introduci un motiv!');

    message.guild.fetchBans().then(async bans => {
      const targetMember = bans.find(ban => ban.user.id === member.id);

      
      if (targetMember) {console.log(targetMember)
        await guildSettings.updateOne({
          cases: guildSettings.cases + 1
        }).catch(error => console.error(error));
        console.log(targetMember)
        message.channel.send(`**${member.tag}** a fost debanat cu succes!`);

        const unbanEmbed = new Discord.MessageEmbed()
          .setTitle(`Unban | Cazul #${guildSettings.cases + 1}`)
          .setColor('#f55656')
          .setFooter(`ID MEMBRU: ${targetMember.user.id}`)
          .setTimestamp(new Date())
          .setDescription(`**Membru:** ${targetMember.user.tag}\n**Motiv:** ${reasonText}\n**Moderator răspunzător:** ${message.author.tag}`)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

        message.guild.members.unban(targetMember.user.id, reasonText).then(() => logsChannel.send(unbanEmbed)).catch(error => console.error(error));
      } else {
        return message.reply('membrul mentionat nu este banat!')
      }
    }).catch(() => message.channel.send('Tocmai a apărut o eroare la rularea acestei comenzi. Mai încearcă o dată!'));
  }
};