const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
const User = require('../../models/user');

module.exports = {
  name: 'guess',
  description: `Joacă unul dintre jocurile lui Omuletzu', în care trebuie să ghicești cifra la care se gândește!`,
  color: '#3beb72',
  cooldown: 20,
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

    class GuessGame {
      constructor() {
        this.inGame = false;
        this.number = -1;
        this.mistakes = 0;
      }
    
      newGame() {
        if (this.inGame) return;
    
        this.inGame = true;
        this.number = Math.floor(Math.random() * 10);
        this.mistakes = 0;

        console.log(`Guess Game: ${this.number}`);
    
        const startEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(':bulb: Ghicește cifra!')
          .setDescription('Trebuie să ghicești cifra la care mă gândesc!')
          .addField(`Reguli și informatii:`, [
            `→ Ai doar 3 încercări.`,
            `→ Ai 15 secunde la dispozitie între încercări.`,
            `→ Poti trimite doar o cifră (0 - 9) deodată!`
          ])
          .addField(`Jocul a început.`, `Mult succes!`)
          .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
    
        message.channel.send(startEmbed);
        this.waitForResponse();
      }
    
      makeGuess(guessedNumber) {
        if (guessedNumber >= 0 && guessedNumber < 10) {
          if (this.number != guessedNumber) {
            this.mistakes++;
            let tries = 3 - this.mistakes;
            if (tries == 2) {
              const wrongEmbed = new Discord.MessageEmbed()
                .setColor('#fcc95e')
                .setTitle(':warning: Răspuns greșit!')
                .setDescription(`Nu mă gândeam la cifra ${guessedNumber}! Mai ai încă două încercări.`)
                .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
              message.channel.send(wrongEmbed);
            }
            else if (tries == 1) {
              const wrongEmbed = new Discord.MessageEmbed()
                .setColor('#fcc95e')
                .setTitle(':warning: Răspuns greșit!')
                .setDescription(`Nu mă gândeam la cifra ${guessedNumber}! Mai ai doar o încercare.`)
                .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
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
            .setColor('#f55656')
            .setTitle(':no_entry_sign: Eroare!')
            .setDescription(`Nu ai introdus o cifră. Încearcă din nou!`)
            .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
          message.channel.send(wrongEmbed);
        }
        if (this.inGame)
        this.waitForResponse();
      }
    
      async gameOver(value) {
        this.inGame = false;
        if (value) {  
          await userSettings.updateOne({
            guessGame: userSettings.guessGame + 1
          }).catch(error => console.error(error));

          const endEmbed = new Discord.MessageEmbed()
            .setColor('#3beb72')
            .setTitle(`:clap: Felicitări! Ai câștigat jocul!`)
            .setDescription(`Cifra la care mă gândeam era ${this.number}. Ai acumulat în total \`${userSettings.guessGame + 1 >= 20 ? userSettings.guessGame + 1 + ' de' : userSettings.guessGame + 1}\` ${userSettings.guessGame + 1 == 1 ? ' punct' : ' puncte'} la acest joc!\nFolosește comanda \`${guildSettings.prefix}leaderboard guess\` pentru a vedea topul membrilor acestui server.`)
            .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
          return message.channel.send(endEmbed);
        }
        else {
          const endEmbed = new Discord.MessageEmbed()
            .setColor('#f55656')
            .setTitle(':disappointed: Ai pierdut jocul!')
            .setDescription(`Cifra la care mă gândeam era ${this.number}. Ai acumulat în total \`${userSettings.guessGame >= 20 ? userSettings.guessGame + ' de' : userSettings.guessGame}\` ${userSettings.guessGame == 1 ? ' punct' : ' puncte'} la acest joc!\nFolosește comanda \`${guildSettings.prefix}leaderboard guess\` pentru a vedea topul membrilor acestui server.`)
            .setFooter(`${member.user.tag}`, `${message.author.displayAvatarURL()}`);
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

    const guessGame = new GuessGame();
    guessGame.newGame();
  }
};