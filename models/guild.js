const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  prefix: String,
  logsChannelID: String,
  modRoles: Array,
  cases: Number,
  maxWarns: Number,
  wordChainChannelID: String,
  wordChainCurrentWord: String,
  wordChainCurrentWinner: String
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');