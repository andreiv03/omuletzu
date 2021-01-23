const Guild = require('../models/guild');

module.exports = async (client, channel) => {
  await Guild.findOne({
    guildID: channel.guild.id
  }, (error, guild) => {
    if (error) console.error(error);

    if (guild && guild.logsChannelID == channel.id) {
      guild.updateOne({
        logsChannelID: null
      }).catch(error => console.error(error));
    } else if (guild && guild.wordChainChannelID == channel.id) {
      guild.updateOne({
        wordChainChannelID: null
      }).catch(error => console.error(error));
    }
  });
};