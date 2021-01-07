const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'giveaway',
  description: 'Crează un giveaway pentru membrii acestui server.',
  color: '#fcc95e',
  permissions: ['Manage Server'],
  cooldown: 5,
  guildOnly: true,
  async execute(message, args, client) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');
    }

    class Giveaway {
      constructor() {
        this.channel;
        this.prize;
        this.time;
        this.winners;
        this.mention;
        this.tries = 3;
      }

      newGiveaway() {
        const startEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(`:tada: Giveaway powered by Omuletzu'`)
          .setFooter(`Scrie "cancel" în chat pentru a opri giveaway-ul.`)
          .setDescription(`Ești sigur că vrei să creezi un giveaway? \`DA / NU\``); 
        message.channel.send(startEmbed);

        this.confirmationResponse();
      }

      endGiveaway(value) {
        if (value) {
          client.giveawaysManager.start(this.channel, {
            time: ms(this.time + 'm'),
            prize: this.prize,
            winnerCount: this.winners,
            hostedBy: message.author,
            messages: {
              giveaway: `${this.mention ? this.mention : ''}`,
              giveawayEnded: `${this.mention ? this.mention : ''}`,
              inviteToParticipate: "Reactionează cu :tada: pentru a participa!",
              timeRemaining: "Timp rămas: **{duration}**",
              winMessage: "Felicitări, {winners}!\nPremiul câștigat este **{prize}**",
              hostedBy: "Giveaway hostat de {user}",
              embedFooter: `Giveaway powered by Omuletzu'`,
              noWinner: "Nu am putut determina un câștigător!",
              winners: "câștigător(i)",
              endedAt: "Giveaway powered by Omuletzu'",
              units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: true
              }
            }
          });
        } else if (!value) {
          const endEmbed = new Discord.MessageEmbed()
            .setColor('#f55656')
            .setTitle(`:no_entry_sign: Giveaway powered by Omuletzu'`)
            .setFooter(`Folosește comanda "help" pentru a vedea comenzile diposnibile.`)
            .setDescription('Giveaway-ul a fost anulat, deoarece nu ai respectat cerintele.');
          
          return message.channel.send(endEmbed);
        }
      }


      channelEmbed() {
        const channelEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(`:tada: Giveaway powered by Omuletzu'`)
          .setFooter(`Scrie "cancel" în chat pentru a opri giveaway-ul.`)
          .setDescription(`Mentionează canalul pe care vrei să fie giveaway-ul. \`Mai ai ${this.tries} încercări.\``); 
        message.channel.send(channelEmbed);

        this.channelResponse();
      }

      prizeEmbed() {
        const prizeEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(`:tada: Giveaway powered by Omuletzu'`)
          .setFooter(`Scrie "cancel" în chat pentru a opri giveaway-ul.`)
          .setDescription(`Care este premiul giveaway-ului?`); 
        message.channel.send(prizeEmbed);

        this.prizeResponse();
      }

      timeEmbed() {
        const timeEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(`:tada: Giveaway powered by Omuletzu'`)
          .setFooter(`Scrie "cancel" în chat pentru a opri giveaway-ul.`)
          .setDescription(`Cât timp (minute) o să dureze giveaway-ul? \`Mai ai ${this.tries} încercări.\`\n*60 = o oră, 1440 = o zi, 10800 = o lună*`); 
        message.channel.send(timeEmbed);

        this.timeResponse();
      }

      winnersEmbed() {
        const winnersEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(`:tada: Giveaway powered by Omuletzu'`)
          .setFooter(`Scrie "cancel" în chat pentru a opri giveaway-ul.`)
          .setDescription(`Câti câștigători o să aibă giveaway-ul? \`Mai ai ${this.tries} încercări.\``); 
        message.channel.send(winnersEmbed);

        this.winnersResponse();
      }

      mentionEmbed() {
        const mentionEmbed = new Discord.MessageEmbed()
          .setColor('#fcc95e')
          .setTitle(`:tada: Giveaway powered by Omuletzu'`)
          .setFooter(`Scrie "cancel" în chat pentru a opri giveaway-ul.`)
          .setDescription(`Mentionează rolul care vrei să primească notificare despre giveaway.\nDacă nu vrei să mentionezi un rol, scrie orice altceva în chat.`); 
        message.channel.send(mentionEmbed);

        this.mentionResponse();
      }


      confirmationResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 40000
        }).then(collected => {
          if (collected.first().content.toLowerCase() == 'da') this.channelEmbed();
          else this.endGiveaway(false);
        }).catch(() => this.endGiveaway(false));
      }

      channelResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 40000
        }).then(collected => {
          const msg = collected.first().mentions.channels.first();
          if (collected.first().content.toLowerCase() == 'cancel') this.endGiveaway(false);
          else if (!msg) {
            this.tries--;
            if (this.tries == 0) this.endGiveaway(false);
            else this.channelEmbed();
          } else {
            this.channel = msg;
            this.tries = 3;
            this.prizeEmbed();
          }
        }).catch(() => this.endGiveaway(false));
      }

      prizeResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 40000
        }).then(collected => {
          const msg = collected.first().content;
          if (collected.first().content.toLowerCase() == 'cancel') this.endGiveaway(false);
          else {
            this.prize = msg;
            this.timeEmbed();
          }
        }).catch(() => this.endGiveaway(false));
      }

      timeResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 40000
        }).then(collected => {
          const msg = collected.first().content;
          if (collected.first().content.toLowerCase() == 'cancel') this.endGiveaway(false);
          else if (isNaN(msg)) {
            this.tries--;
            if (this.tries == 0) this.endGiveaway(false);
            else this.timeEmbed();
          } else {
            this.time = msg;
            this.tries = 3;
            this.winnersEmbed();
          }
        }).catch(() => this.endGiveaway(false));
      }

      winnersResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 40000
        }).then(collected => {
          const msg = collected.first().content;
          if (collected.first().content.toLowerCase() == 'cancel') this.endGiveaway(false);
          else if (isNaN(msg)) {
            this.tries--;
            if (this.tries == 0) this.endGiveaway(false);
            else this.winnersEmbed();
          } else {
            this.winners = msg;
            this.tries = 3;
            this.mentionEmbed();
          }
        }).catch(() => this.endGiveaway(false));
      }

      mentionResponse() {
        message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
          max: 1,
          time: 40000
        }).then(collected => {
          const msg = collected.first().mentions.roles.first();
          let ok = false;
          if (!msg) {
            ok = collected.first().mentions.everyone;
            if (ok) this.mention = '@everyone';
            this.endGiveaway(true);
          } else if (msg) {
            this.mention = msg;
            this.endGiveaway(true);
          } else this.endGiveaway(true);
        }).catch(() => this.endGiveaway(false));
      }
    }

    let giveaway = new Giveaway();
    giveaway.newGiveaway();
  }
};