const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../models/guild');
const User = require('../models/user');

module.exports = {
  name: 'hangman',
  description: `Joacă spânzurătoarea, jocul preferat al lui Omuletzu'!`,
  color: '#3beb72',
  cooldown: 30,
  guildOnly: true,
  async execute(message) {
    const member = message.member;

    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    let userSettings;
    await User.findOne({
      guildID: message.guild.id,
      userID: member.user.id
    }, async (error, user) => {
      if (error) console.error(error);

      if (!user) {
        const newUser = new User({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          userID: member.user.id,
          warns: [],
          guessGame: 0,
          hangmanGame: 0
        });

        userSettings = newUser;
        await newUser.save().catch(error => console.error(error));
      } else userSettings = user;
    });

    const words = ['camion', 'animal', 'robot', 'balaur', 'elicopter', 'maxim', 'tractor', 'calculator', 'chimie', 'dinozaur', 'enciclopedie', 'telefon', 'calorifer', 'vampir', 'negru', 'albastru', 'praf', 'vis', 'amintire', 'blog', 'fotografie', 'ochelari', 'trecut', 'durere', 'monument', 'portocaliu', 'sentiment', 'sinucidere', 'suflet', 'aglomerat'];

    class HangmanGame {
      constructor() {
        this.gameEmbed = null;
        this.inGame = false;
        this.word = '';
        this.letters = [];
        this.mistakes = 0;
      }

      newGame() {
        if (this.inGame) return;

        this.inGame = true;
        this.word = words[Math.floor(Math.random() * words.length)].toUpperCase();
        this.letters = [];
        this.mistakes = 0;

        console.log(`Hangman Game: ${this.word}`);

        const startEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(':skull_crossbones: Spânzurătoarea!')
          .setDescription(this.getDescription())
          .addField(`Reguli și informatii:`, [
            `→ Tastează o singură literă în chat, altfel jocul se va sfârși!`,
            `→ Ai dreptul la o singură încercare de a ghici cuvântul întreg!`,
            `→ Poti avea doar 5 greșeli.`,
            `→ Ai 30 de secunde la dispozitie între încercări.`,
            `\u200b`
          ])
          .addField(`Jocul a început.`, `Mult succes!`)
          .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);

        message.channel.send(startEmbed).then(msg => {
          this.gameEmbed = msg;
          this.waitForResponse();
        });
      }

      makeGuess(guessedLetter) {
        if (guessedLetter.toUpperCase() == this.word) return this.gameOver(true);
        if (guessedLetter.length > 1) return this.gameOver(false);
        guessedLetter = guessedLetter.toUpperCase();
        if (!this.letters.includes(guessedLetter)) {
          this.letters.push(guessedLetter);
          if (this.word.indexOf(guessedLetter) == -1) {
            this.mistakes++;
            if (this.mistakes == 6) this.gameOver(false);
          }
          else if (!this.word.split('').map(l => this.letters.includes(l) ? l : '_').includes('_')) this.gameOver(true);
        }
        if (this.inGame) {
          const editEmbed = new Discord.MessageEmbed()
            .setColor('#fcc95e')
            .setDescription(this.getDescription())
            .addField(`Litere folosite`, this.letters.length == 0 ? `\u200b` : this.letters.join(' ') + `\n`)
            .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
          this.gameEmbed.edit(editEmbed);
          this.waitForResponse();
        }
      }

      async gameOver(value) {
        this.gameEmbed.delete();
        this.inGame = false;

        if (value) {
          await userSettings.updateOne({
            hangmanGame: userSettings.hangmanGame + 1
          }).catch(error => console.error(error));

          const endEmbed = new Discord.MessageEmbed()
            .setColor('#3beb72')
            .setDescription(this.getEndDescription())
            .addField(':clap: Felicitări! Ai câștigat jocul!', `Cuvântul era \`${this.word}\`. Ai acumulat în total \`${userSettings.hangmanGame + 1 >= 20 ? userSettings.hangmanGame + 1 + ' de' : userSettings.hangmanGame + 1}\` ${userSettings.hangmanGame + 1 == 1 ? ' punct' : ' puncte'} la acest joc!\nFolosește comanda \`${guildSettings.prefix}leaderboard hangman\` pentru a vedea topul membrilor acestui server.`)
            .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
          return message.channel.send(endEmbed);
        } else {
          const endEmbed = new Discord.MessageEmbed()
            .setColor('#f55656')
            .setDescription(this.getEndDescription())
            .addField(':disappointed: Ai pierdut jocul!', `Cuvântul era \`${this.word}\`. Ai acumulat în total \`${userSettings.hangmanGame >= 20 ? userSettings.hangmanGame + ' de' : userSettings.hangmanGame}\` ${userSettings.hangmanGame == 1 ? ' punct' : ' puncte'} la acest joc!\nFolosește comanda \`${guildSettings.prefix}leaderboards\` pentru a vedea topul membrilor acestui server.`)
            .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
          return message.channel.send(endEmbed);
        }
      }

      getDescription() {
        return '```'
          + '|‾‾‾‾‾‾|   \n|     '
          + (this.mistakes > 0 ? '🧢' : ' ')
          + '   \n|     '
          + (this.mistakes > 1 ? '😨' : ' ')
          + '   \n|     '
          + (this.mistakes > 2 ? '👕' : ' ')
          + '   \n|     '
          + (this.mistakes > 3 ? '👖' : ' ')
          + '   \n|     '
          + (this.mistakes > 4 ? '👟' : ' ')
          + '   \n|     '
          + (this.mistakes > 5 ? '🔥' : ' ')
          + '   \n|__________\n\n'
          + this.word.split('').map(letter => this.letters.includes(letter) ? letter : '_').join(' ')
          + '```';
      }

      getEndDescription() {
        return '```'
          + '|‾‾‾‾‾‾|   \n|     '
          + (this.mistakes > 0 ? '🧢' : ' ')
          + '   \n|     '
          + (this.mistakes > 1 ? '😨' : ' ')
          + '   \n|     '
          + (this.mistakes > 2 ? '👕' : ' ')
          + '   \n|     '
          + (this.mistakes > 3 ? '👖' : ' ')
          + '   \n|     '
          + (this.mistakes > 4 ? '👟' : ' ')
          + '   \n|     '
          + (this.mistakes > 5 ? '🔥' : ' ')
          + '   \n|__________\n\n'
          + this.word.split('').join(' ')
          + '```';
      }

      waitForResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 30000
        }).then(collected => {
          let guessedLetter = collected.first().content;
          collected.first().delete();
          this.makeGuess(guessedLetter);
        }).catch(() => {
          this.gameOver(false);
        });
      }
    }

    const hangmanGame = new HangmanGame();
    hangmanGame.newGame();
  }
};