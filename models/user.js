const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  userID: String,
  warns: [Object],
  mute: Object
});

module.exports = mongoose.model('User', userSchema, 'users');