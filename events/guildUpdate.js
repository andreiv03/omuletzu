const Guild = require('../models/guild');

module.exports = async (client, oldGuild, newGuild) => {
  if (oldGuild.name != newGuild.name) {
    const settings = await Guild.findOne({
      guildID: oldGuild.id
    }, (error) => {
      if (error) console.error(error);
    });

    await settings.updateOne({
      guildName: newGuild.name
    }).catch(error => console.error(error));
  }
};