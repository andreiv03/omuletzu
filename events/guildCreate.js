const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (client, guild) => {
  guild = new Guild({
    _id: mongoose.Types.ObjectId(),
    guildID: guild.id,
    guildName: guild.name,
    prefix: process.env.PREFIX,
    logsChannelID: null,
    modRoles: [],
    cases: 0,
    maxWarns: 10,
    wordChainChannelID: null,
    wordChainCurrentWord: null,
    wordChainCurrentWinner: null
  });

  guild.save().then(result => console.log(result)).catch(error => console.error(error));

  console.log(`Omulezu' has joined a server!`);
};