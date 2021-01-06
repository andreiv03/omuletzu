const Discord = require('discord.js');

let message, member;

class guessGame {
  constructor() {
    this.inGame = false;
    this.number = -1;
    this.mistakes = 0;
  }

  newGame(msg, mbr) {
    message = msg;
    member = mbr;

    if (this.inGame) return;
    const thisCopy = this;

    this.inGame = true;
    this.number = Math.floor(Math.random() * 10);
    this.mistakes = 0;
    console.log(`Guess Game: ${this.number}`);

    const startEmbed = new Discord.MessageEmbed()
      .setColor('#fcc95e')
      .setTitle(':interrobang: Ghicește cifra!')
      .setDescription('Trebuie să ghicești cifra la care mă gândesc!')
      .addField(`Reguli și informatii:`, [
        `→ Ai doar 3 încercări`,
        `→ Ai 15 secunde la dispozitie între încercări`,
        `→ Poti trimite doar o cifră (0 - 9) deodată!`
      ])
      .addField(`Jocul începe în câteva secunde...`, `Așteaptă putin!`)
      .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);

    message.channel.send(startEmbed).then(m => {
      let condition = false;
      let check = function () {
        if (condition) {
          let editEmbed;
          editEmbed = new Discord.MessageEmbed()
            .setColor('#fcc95e')
            .setTitle(':interrobang: Ghicește cifra!')
            .setDescription('Trebuie să ghicești cifra la care mă gândesc!')
            .addField(`Reguli și informatii:`, [
              `→ 3 încercări`,
              `→ 15 secunde la dispozitie între încercări`,
              `→ Poti trimite doar o cifră (0 - 9) deodată!`
            ])
            .addField(`Jocul a început!`, `Mult succes!`)
            .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
          m.edit(editEmbed);
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

  makeGuess(guessedNumber) {
    if (guessedNumber >= 0 && guessedNumber < 10) {
      if (this.number != guessedNumber) {
        this.mistakes++;
        let tries = 3 - this.mistakes;
        if (tries == 2) {
          const wrongEmbed = new Discord.MessageEmbed()
            .setColor('#fcc95e')
            .setTitle(':warning: Nu asta era cifra!')
            .setDescription(`Mai ai \`${tries}\` încercări.`)
            .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
          message.channel.send(wrongEmbed);
        }
        else if (tries == 1) {
          const wrongEmbed = new Discord.MessageEmbed()
            .setColor('#fcc95e')
            .setTitle(':warning: Nu asta era cifra!')
            .setDescription(`Mai ai \`${tries}\` încercare.`)
            .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
          message.channel.send(wrongEmbed);
        }
        if (this.mistakes == 3)
          this.gameOver(false);
      }
      else if (this.number == guessedNumber)
        this.gameOver(true);
    }
    else {
      const wrongEmbed = new Discord.MessageEmbed()
        .setColor('#eb1010')
        .setTitle(':x: Nu ai introdus o cifră.')
        .setDescription(`Încearcă din nou!`)
        .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
      message.channel.send(wrongEmbed);
    }
    if (this.inGame)
    this.waitForResponse();
  }

  gameOver(value) {
    this.inGame = false;
    if (value) {  
      const endEmbed = new Discord.MessageEmbed()
        .setColor('#22e32f')
        .setTitle(`:clap: Felicitări! Ai câștigat jocul!`)
        .setDescription(`Cifra la care mă gândeam era \`${this.number}\`.`)
        .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
      return message.channel.send(endEmbed);
    }
    else {
      const endEmbed = new Discord.MessageEmbed()
        .setColor('#eb1010')
        .setTitle(':disappointed: Ai pierdut jocul!')
        .setDescription(`Cifra la care mă gândeam era \`${this.number}\`.`)
        .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);
      return message.channel.send(endEmbed)
    }
  }

  waitForResponse() {
    message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
      max: 1,
      time: 15000
    }).then(collected => {
      let guessedNumber = collected.first().content;
      this.makeGuess(guessedNumber);
    }).catch(() => {
      this.gameOver(false);
    });
  }
}

module.exports = guessGame;