const Guild = require('../models/guild');

module.exports = async (client, guild) => {
  Guild.findOneAndDelete({
    guildID: guild.id
  }, (error) => {
    if (error) console.error(error);
    console.log(`Omuletzu' has been removed from a server!`);
  });
};