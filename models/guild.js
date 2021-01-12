const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  prefix: String,
  logsChannelID: String,
  cases: Number,
  maxWarns: Number
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');