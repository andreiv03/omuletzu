const Guild = require('../models/guild');

module.exports = async (client, role) => {
  await Guild.findOne({
    guildID: role.guild.id
  }, (error, guild) => {
    if (error) console.error(error);

    guild.modRoles.map((r, index) => {
      if (r == role.id) {
        let roles = guild.modRoles;
        roles.splice(index, 1);

        guild.updateOne({
          modRoles: roles
        }).catch(error => console.error(error));
      }
    });
  });
};