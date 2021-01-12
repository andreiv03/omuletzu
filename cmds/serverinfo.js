const Discord = require('discord.js');
const moment = require('moment');

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
  'us-east': 'US East',
  'us-south': 'US South',
	'us-west': 'US West'
};

module.exports = {
  name: 'serverinfo',
  aliases: ['sinfo'],
  description: 'Afișează detaliile generale ale acestui server.',
  color: '#fcc95e',
  cooldown: 5,
  guildOnly: true,
  execute(message) {
    const members = message.guild.members.cache;

    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => !role.managed ? role.toString() : 'N/A').slice(0, -1);
    let serverRoles = [], i = 0, k = roles.length - 10, botRoles = 0;
    for (const value of roles) {
      if (value != 'N/A') serverRoles[i++] = value;
      else botRoles++;
      if (i > 9) break;
    }
    if (i == 10) serverRoles[i] = `și alte ${k} roluri.`

    const infoEmbed = new Discord.MessageEmbed()
      .setColor('#fcc95e')
      .addField('Detalii generale:', [
        `**Nume:** ${message.guild.name}`,
        `**Regiune:** ${regions[message.guild.region]}`,
        `**ID:** ${message.guild.id}`,
        `**Imaginea server-ului:** [LINK](${message.guild.iconURL({ dynamic: true })})`,
        `**Owner:** ${message.guild.owner}`,
        `**Creare server:** ${moment(message.guild.createdTimestamp).format('LL')}, ${moment(message.guild.createdTimestamp).fromNow()}`,
        `**Server Boost:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'Tier 0'}`,
        '\u200b'
      ], true)
      .addField('Activitate:', [
        `**Online:** ${members.filter(member => member.presence.status === 'online').size}`,
				`**Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
				`**Busy:** ${members.filter(member => member.presence.status === 'dnd').size}`,
        `**Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
        '\u200b'
      ], true)
      .addField('Alte informatii:', [
        `**Număr membri:** ${message.guild.memberCount - members.filter(member => member.user.bot).size}`,
        `**Număr boti:** ${members.filter(member => member.user.bot).size}`,
        `**Emoji-uri statice:** ${message.guild.emojis.cache.filter(emoji => !emoji.animated).size}`,
        `**Emoji-uri animate:** ${message.guild.emojis.cache.filter(emoji => emoji.animated).size}`,
        `**Canale de tip text:** ${message.guild.channels.cache.filter(channel => channel.type == 'text').size}`,
        `**Canale de tip voice:** ${message.guild.channels.cache.filter(channel => channel.type == 'voice').size}`,
        `**Roluri [${roles.length - botRoles}]:** ${serverRoles.join(', ')}`,
      ], false);

    if (message.guild.iconURL()) 
      infoEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
    else infoEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');

    return message.channel.send(infoEmbed);
  }
};