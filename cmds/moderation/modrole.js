const Guild = require('../../models/guild');

module.exports = {
  name: 'modrole',
  description: 'Setează sau șterge rolurile de moderator (unul deodată) pentru acest server. Dacă mentionezi un rol care este deja setat, acesta va fi eliminat din lista rolurilor de moderator.\n\nMembrii care au unul dintre aceste roluri nu au nevoie de nicio altă permisiune pentru a folosi comenzile de moderare. Însă, dacă au permisiunile necesare, aceștia pot folosi comenzile de moderare și fără rol de moderator!',
  color: '#f55656',
  usage: '<rol>',
  permissions: ['Manage Server'],
  cooldown: 10,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.reply('nu ai mentionat un rol valid!');
    if (role.managed) return message.reply('nu poti seta rolul unui bot!');

    await Guild.findOne({
      guildID: message.guild.id
    }, (error, guild) => {
      if (error) console.error(error);

      if (guild.modRoles.some(r => r == role.id)) {
        guild.modRoles.map((r, index) => {
          if (r == role.id) {
            let theRoles = guild.modRoles;
            theRoles.splice(index, 1);

            guild.updateOne({
              modRoles: theRoles
            }).catch(error => console.error(error));

            return message.channel.send(`Rolul **${role.name}** a fost eliminat cu succes!`);
          }
        }) 
      } else {
        guild.updateOne({
          $push: {
            modRoles: role.id
          }
        }).catch(error => console.error(error));

        return message.channel.send(`Rolul **${role.name}** a fost setat cu succes!`);
      }
    });
  }
};