const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (guild) => {
  guild = new Guild({
    _id: mongoose.Types.ObjectId(),
    guildID: guild.id,
    guildName: guild.name,
  });

  guild.save().then(result => console.log(result)).catch(error => console.error(error));

  console.log(`Omulezu' has joined a server!`);
};