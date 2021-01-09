const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (client, guild) => {
  guild = new Guild({
    _id: mongoose.Types.ObjectId(),
    guildID: guild.id,
    guildName: guild.name,
    prefix: process.env.PREFIX,
    logsChannelID: null,
    cases: 0
  });

  guild.save().then(result => console.log(result)).catch(error => console.error(error));

  console.log(`Omulezu' has joined a server!`);
};