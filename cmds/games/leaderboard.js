const Discord = require('discord.js');
const Guild = require('../../models/guild');
const User = require('../../models/user');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb'],
  description: `Afișează topul membrilor acestui server la jocurile lui Omuletzu'.\nOptiuni diposnibile: \`guess | hangman\``,
  color: '#3beb72',
  usage: '<nume joc>',
  cooldown: 5,
  guildOnly: true,
  async execute(message, args) {
    if (!args[0]) return message.reply('trebuie să folosești comanda împreună cu unul dintre jocurile disponibile: \`guess | hangman\`');
    
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (args[0].toLowerCase() == 'guess') {
      const guessLeaderboard = new Discord.MessageEmbed()
        .setColor('#fcc95e')
        .setTitle(':trophy: Top 5 la jocul Ghicește cifra')
        .setFooter(`Tastează comanda ${guildSettings.prefix}guess pentru a te juca.`);
      let guessDescription = '';

      await User.find({
        guildID: message.guild.id,
      }, async (error, users) => {
        if (error) console.error(error);

        const theUsers = users.sort((a, b) => b.guessGame - a.guessGame);
        let firstPoints = secondPoints = thirdPoints = fourthPoints = fifthPoints = 'N/A';

        if (theUsers[0] && theUsers[0].guessGame) {
          firstPoints = '** - ' + (theUsers[0].guessGame >= 20 ? theUsers[0].guessGame + ' de' : theUsers[0].guessGame);
          firstPoints += theUsers[0].guessGame == 1 ? ' punct' : ' puncte';
          guessDescription += ':first_place: **' + message.guild.members.cache.get(theUsers[0].userID).user.tag + firstPoints + '\n';
        } else guessDescription += ':first_place: ' + firstPoints + '\n';

        if (theUsers[1] && theUsers[1].guessGame) {
          secondPoints = '** - ' + (theUsers[1].guessGame >= 20 ? theUsers[1].guessGame + ' de' : theUsers[1].guessGame);
          secondPoints += theUsers[1].guessGame == 1 ? ' punct' : ' puncte';
          guessDescription += ':second_place: **' + message.guild.members.cache.get(theUsers[1].userID).user.tag + secondPoints + '\n';
        } else guessDescription += ':second_place: ' + secondPoints + '\n';

        if (theUsers[2] && theUsers[2].guessGame) {
          thirdPoints = '** - ' + (theUsers[2].guessGame >= 20 ? theUsers[2].guessGame + ' de' : theUsers[2].guessGame);
          thirdPoints += theUsers[2].guessGame == 1 ? ' punct' : ' puncte';
          guessDescription += ':third_place: **' + message.guild.members.cache.get(theUsers[2].userID).user.tag + thirdPoints + '\n';
        } else guessDescription += ':third_place: ' + thirdPoints + '\n';

        if (theUsers[3] && theUsers[3].guessGame) {
          fourthPoints = ' - ' + (theUsers[3].guessGame >= 20 ? theUsers[3].guessGame + ' de' : theUsers[3].guessGame);
          fourthPoints += theUsers[3].guessGame == 1 ? ' punct' : ' puncte';
          guessDescription += ':reminder_ribbon: ' + message.guild.members.cache.get(theUsers[3].userID).user.tag + fourthPoints + '\n';
        } else guessDescription += ':reminder_ribbon: ' + fourthPoints + '\n';

        if (theUsers[4] && theUsers[4].guessGame) {
          fifthPoints = ' - ' + (theUsers[4].guessGame >= 20 ? theUsers[4].guessGame + ' de' : theUsers[4].guessGame);
          fifthPoints += theUsers[4].guessGame == 1 ? ' punct' : ' puncte';
          guessDescription += ':reminder_ribbon: ' + message.guild.members.cache.get(theUsers[4].userID).user.tag + fifthPoints + '\n';
        } else guessDescription += ':reminder_ribbon: ' + fifthPoints + '\n';

        if (guessDescription) {
          guessLeaderboard.setDescription(guessDescription);
          return message.channel.send(guessLeaderboard);
        } else return message.reply(`nu a jucat nimeni acest joc din server-ul ${message.guild.name}!`);
      });
    }

    else if (args[0].toLowerCase() == 'hangman') {
      const hangmanLeaderboard = new Discord.MessageEmbed()
        .setColor('#fcc95e')
        .setTitle(':trophy: Top 5 la jocul Spânzurătoarea')
        .setFooter(`Tastează comanda ${guildSettings.prefix}hangman pentru a te juca.`);
      let hangmanDescription = '';

      await User.find({
        guildID: message.guild.id,
      }, async (error, users) => {
        if (error) console.error(error);

        const theUsers = users.sort((a, b) => b.hangmanGame - a.hangmanGame);
        let firstPoints = secondPoints = thirdPoints = fourthPoints = fifthPoints = 'N/A';

        if (theUsers[0] && theUsers[0].hangmanGame) {
          firstPoints = '** - ' + (theUsers[0].hangmanGame >= 20 ? theUsers[0].hangmanGame + ' de' : theUsers[0].hangmanGame);
          firstPoints += theUsers[0].hangmanGame == 1 ? ' punct' : ' puncte';
          hangmanDescription += ':first_place: **' + message.guild.members.cache.get(theUsers[0].userID).user.tag + firstPoints + '\n';
        } else hangmanDescription += ':first_place: ' + firstPoints + '\n';

        if (theUsers[1] && theUsers[1].hangmanGame) {
          secondPoints = '** - ' + (theUsers[1].hangmanGame >= 20 ? theUsers[1].hangmanGame + ' de' : theUsers[1].hangmanGame);
          secondPoints += theUsers[1].hangmanGame == 1 ? ' punct' : ' puncte';
          hangmanDescription += ':second_place: **' + message.guild.members.cache.get(theUsers[1].userID).user.tag + secondPoints + '\n';
        } else hangmanDescription += ':second_place: ' + secondPoints + '\n';

        if (theUsers[2] && theUsers[2].hangmanGame) {
          thirdPoints = '** - ' + (theUsers[2].hangmanGame >= 20 ? theUsers[2].hangmanGame + ' de' : theUsers[2].hangmanGame);
          thirdPoints += theUsers[2].hangmanGame == 1 ? ' punct' : ' puncte';
          hangmanDescription += ':third_place: **' + message.guild.members.cache.get(theUsers[2].userID).user.tag + thirdPoints + '\n';
        } else hangmanDescription += ':third_place: ' + thirdPoints + '\n';

        if (theUsers[3] && theUsers[3].hangmanGame) {
          fourthPoints = ' - ' + (theUsers[3].hangmanGame >= 20 ? theUsers[3].hangmanGame + ' de' : theUsers[3].hangmanGame);
          fourthPoints += theUsers[3].hangmanGame == 1 ? ' punct' : ' puncte';
          hangmanDescription += ':reminder_ribbon: ' + message.guild.members.cache.get(theUsers[3].userID).user.tag + fourthPoints + '\n';
        } else hangmanDescription += ':reminder_ribbon: ' + fourthPoints + '\n';

        if (theUsers[4] && theUsers[4].hangmanGame) {
          fifthPoints = ' - ' + (theUsers[4].hangmanGame >= 20 ? theUsers[4].hangmanGame + ' de' : theUsers[4].hangmanGame);
          fifthPoints += theUsers[4].hangmanGame == 1 ? ' punct' : ' puncte';
          hangmanDescription += ':reminder_ribbon: ' + message.guild.members.cache.get(theUsers[4].userID).user.tag + fifthPoints + '\n';
        } else hangmanDescription += ':reminder_ribbon: ' + fifthPoints + '\n';

        if (hangmanDescription) {
          hangmanLeaderboard.setDescription(hangmanDescription);
          return message.channel.send(hangmanLeaderboard);
        } else return message.reply(`nu a jucat nimeni acest joc din server-ul ${message.guild.name}!`);
      });
    } else return message.reply('nu ai introdus o optiune validă! Optiuni diposnibile: \`guess | hangman\`')
  }
};