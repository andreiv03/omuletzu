const Discord = require('discord.js');

const words = ['camion', 'animal', 'robot', 'balaur', 'elicopter', 'maxim', 'tractor', 'calculator', 'chimie', 'dinozaur', 'enciclopedie', 'telefon', 'omuletzu', 'vampir', 'negru', 'albastru', 'praf', 'vis', 'amintire', 'blog', 'fotografie', 'ochelari', 'trecut', 'durere', 'monument', 'portocaliu', 'sentiment', 'sinucidere', 'suflet', 'aglomerat'];
let message, member;

class hangmanGame {
  constructor() {
    this.gameEmbed = null;
    this.inGame = false;
    this.word = '';
    this.letters = [];
    this.mistakes = 0;
  }

  newGame(msg, mbr) {
    message = msg;
    member = mbr;

    if (this.inGame) return;
    const thisCopy = this;

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
        `→ Ai dreptul la o singură încercare să ghicești cuvântul întreg!`,
        `→ Poti avea doar 5 greșeli.`,
        `→ Ai 45 de secunde la dispozitie între încercări.`,
        `\u200b`
      ])
      .addField(`Jocul începe în câteva secunde... Așteaptă putin!`, `\u200b`)
      .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
    this.gameEmbed = startEmbed;

    message.channel.send(this.gameEmbed).then(m => {
      let condition = false;
      let check = function () {
        if (condition) {
          let editEmbed;
          editEmbed = new Discord.MessageEmbed()
            .setColor('#fcc95e')
            .setTitle(':skull_crossbones: Spânzurătoarea!')
            .setDescription(thisCopy.getDescription())
            .addField(`Reguli și informatii:`, [
              `→ Tastează o singură literă în chat, altfel jocul se va sfârși!`,
              `→ Ai dreptul la o singură încercare să ghicești cuvântul întreg!`,
              `→ Poti avea doar 5 greșeli.`,
              `→ Ai 45 de secunde la dispozitie între încercări.`,
              `\u200b`
            ])
            .addField(`Jocul a început! Mult succes!`, `\u200b`)
            .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
          m.edit(editEmbed);
          thisCopy.gameEmbed = m;
          thisCopy.waitForResponse();
        }
        else {
          condition = true;
          setTimeout(check, 1000);
        }
      }
      check();
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
        if (this.mistakes == 6)
          this.gameOver(false);
      }
      else if (!this.word.split('').map(l => this.letters.includes(l) ? l : '_').includes('_')) {
        this.gameOver(true);
      }
    }
    if (this.inGame) {
      const editEmbed = new Discord.MessageEmbed()
        .setColor('#fcc95e')
        .setDescription(this.getDescription())
        .addField(`Litere folosite`, this.letters.length == 0 ? `\u200b` : this.letters.join(' ') + `\n`)
        .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
      this.gameEmbed.edit(editEmbed);
      this.waitForResponse();
    }
  }

  gameOver(value) {
    this.gameEmbed.delete();
    this.inGame = false;

    const endEmbed = new Discord.MessageEmbed()
      .setColor(value ? '#22e32f' : '#eb1010')
      .setTitle(value ? ':clap: Felicitări! Ai câștigat jocul!' : ':disappointed: Ai pierdut jocul!')
      .setDescription(this.getEndDescription())
      .addField(`\u200b`, `Cuvântul era \`${this.word}\`.`)
      .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
    return message.channel.send(endEmbed);
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
      time: 45000
    }).then(collected => {
      let guessedLetter = collected.first().content;
      this.makeGuess(guessedLetter);
    }).catch(() => {
      this.gameOver(false);
    });
  }
}

module.exports = hangmanGame;