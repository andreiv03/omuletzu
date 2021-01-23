const Guild = require('../../models/guild');

module.exports = {
  name: 'modroles',
  description: 'Afișează toate rolurile de moderator existente pe acest server.',
  color: '#f55656',
  permissions: ['Manage Server'],
  cooldown: 10,
  guildOnly: true,
  async execute(message) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    await Guild.findOne({
      guildID: message.guild.id
    }, (error, guild) => {
      if (error) console.error(error);

      let roles = [];
      guild.modRoles.forEach(role => {
        roles.push(`**${message.guild.roles.cache.get(role).name}**`);
      })

      if (roles.length == 1) return message.channel.send(`Rolul de moderator este: ${roles}`);
      else if (roles.length > 1) return message.channel.send(`Rolurile de moderator sunt: ${roles.join(', ')}`);
      else return message.channel.send(`Nu există niciun rol de moderator pe acest server!`);
    });
  }
};