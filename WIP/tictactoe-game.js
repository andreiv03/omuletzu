const Discord = require('discord.js');
const fs = require('fs');
//const scoreTictactoeGame = JSON.parse(fs.readFileSync('./leaderboards/scoreTictactoeGame.json', 'utf8'));

let message, member, mentionedMember, code;

class tictactoeGame {
  constructor() {
    this.inGame = false;
    this.winner = 0;
    this.moves;
    this.positions = { };
    this.availablePositions = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.started = false;
  }

  newGame(msg, mbr, mntn) {
    message = msg;
    member = mbr;
    mentionedMember = mntn;

    /*code = message.author.id.toString().concat('.', message.guild.id.toString());
    if (!scoreGuessGame[code]) {
      scoreGuessGame[code] = {
        scoreGuessGame: 0
      };
      fs.writeFile('./leaderboards/scoreGuessGame.json', JSON.stringify(scoreGuessGame), error => {
        if (error) console.log(error);
      });
    }*/

    if (this.inGame) return;

    this.inGame = true;
    this.winner = 0;
    this.moves = Math.floor(Math.random() * 2);
    this.positions = {
      a1: 0,
      a2: 0,
      a3: 0,
      b1: 0,
      b2: 0,
      b3: 0,
      c1: 0,
      c2: 0,
      c3: 0
    };
    this.availablePositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.started = false;

    const startEmbed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(':pencil2: Tic Tac Toe!')
      .addField(`Reguli și informatii:`, [
        `→ Aveti 60 de secunde la dispozitie între mutări!`,
        `→ Folositi o cifră (1 - 9) pentru a pune o pozitie!`
        //`→ Scrieti cifra 0 în chat pentru a vă da bătuti!`
      ])
      .addField(`Se așteaptă un răspuns din partea lui ${mentionedMember.user.username}...`, `${mentionedMember.user.username}, tastează în chat \`da / yes\` sau \`nu / no\`.\nAi timp 30 de secunde!`)
      .setFooter(`${member.user.username}`, `${message.author.displayAvatarURL()}`);

    message.channel.send(startEmbed)
    this.waitForAccept();
  }
  
  decision(number) {
    const turn = this.moves % 2 == 0 ? message.author.id : mentionedMember.user.id;
    let available = false;
    let numberUndefined = false;
    for (let i of this.availablePositions) {
      if (i == number) available = true;
      if (i != undefined) numberUndefined = true;
    }
    if (!numberUndefined) this.gameOver(0);
    if (!available) {
      message.channel.send('Această pozitie a fost folosită deja!\nAlege alta!');
      this.waitForResponse(turn);
      return;
    }

    delete this.availablePositions[number - 1];

    let position;
    if (number == 1) position = 'a1';
    else if (number == 2) position = 'a2';
    else if (number == 3) position = 'a3';
    else if (number == 4) position = 'b1';
    else if (number == 5) position = 'b2';
    else if (number == 6) position = 'b3';
    else if (number == 7) position = 'c1';
    else if (number == 8) position = 'c2';
    else if (number == 9) position = 'c3';

    this.positions[position] = turn;
    this.moves++;
    this.isFinished();
    if (this.inGame)
      this.table();
  }

  table() {
    const gameEmbed = new Discord.MessageEmbed()
      .setTitle(':pencil2: Tic Tac Toe')
      .setDescription(`${message.author.username} vs ${mentionedMember.user.username}`)
      .setFooter(`Este rândul lui ${this.moves % 2 == 0 ? message.author.username : mentionedMember.user.username}!`)
      .setColor('#e8be3f')
      
    if (!this.started)
      gameEmbed.addField(`Jocul este în progres:`, `:black_large_square: :black_large_square: :black_large_square:
      :black_large_square: :black_large_square: :black_large_square:
      :black_large_square: :black_large_square: :black_large_square:`);
    else gameEmbed.addField(`Jocul este în progres:`, this.firstRow() + '\n' + this.secondRow() + '\n' + this.thirdRow());
    
    message.channel.send(gameEmbed);
    if (!this.started) this.started = true;
    const turn = this.moves % 2 == 0 ? message.author.id : mentionedMember.user.id;
    this.waitForResponse(turn);
  }

  firstRow() {
    let row = '';
    for (let x in this.positions) {
      if (x == 'a1') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
      else if (x == 'a2') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
      else if (x == 'a3') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
    }
    return row;
  }

  secondRow() {
    let row = '';
    for (let x in this.positions) {
      if (x == 'b1') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
      else if (x == 'b2') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
      else if (x == 'b3') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
    }
    return row;
  }

  thirdRow() {
    let row = '';
    for (let x in this.positions) {
      if (x == 'c1') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
      else if (x == 'c2') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
      else if (x == 'c3') {
        if (this.positions[x] == message.author.id) row += ':x: ';
        else if (this.positions[x] == mentionedMember.user.id) row += ':o: ';
        else row += ':black_large_square: ';
      }
    }
    return row;
  }

  isFinished() {
    if (this.positions['a1'] == message.author.id && this.positions['a2'] == message.author.id && this.positions['a3'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['a1'] == mentionedMember.user.id && this.positions['a2'] == mentionedMember.user.id && this.positions['a3'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['b1'] == message.author.id && this.positions['b2'] == message.author.id && this.positions['b3'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['b1'] == mentionedMember.user.id && this.positions['b2'] == mentionedMember.user.id && this.positions['b3'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['c1'] == message.author.id && this.positions['c2'] == message.author.id && this.positions['c3'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['c1'] == mentionedMember.user.id && this.positions['c2'] == mentionedMember.user.id && this.positions['c3'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['a1'] == message.author.id && this.positions['b1'] == message.author.id && this.positions['c1'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['a1'] == mentionedMember.user.id && this.positions['b1'] == mentionedMember.user.id && this.positions['c1'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['a2'] == message.author.id && this.positions['b2'] == message.author.id && this.positions['c2'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['a2'] == mentionedMember.user.id && this.positions['b2'] == mentionedMember.user.id && this.positions['c2'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['a3'] == message.author.id && this.positions['b3'] == message.author.id && this.positions['c3'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['a3'] == mentionedMember.user.id && this.positions['b3'] == mentionedMember.user.id && this.positions['c3'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['a1'] == message.author.id && this.positions['b2'] == message.author.id && this.positions['c3'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['a1'] == mentionedMember.user.id && this.positions['b2'] == mentionedMember.user.id && this.positions['c3'] == mentionedMember.user.id)
      this.gameOver(2);
    else if (this.positions['a3'] == message.author.id && this.positions['b2'] == message.author.id && this.positions['c1'] == message.author.id)
      this.gameOver(1);
    else if (this.positions['a3'] == mentionedMember.user.id && this.positions['b2'] == mentionedMember.user.id && this.positions['c1'] == mentionedMember.user.id)
      this.gameOver(2);
    return;
  }

  gameOver(value) {
    const endEmbed = new Discord.MessageEmbed()
      .setFooter(`${message.author.username} vs ${mentionedMember.user.username}`);
    
    if (!value) 
      endEmbed.setTitle('Nimeni nu a câștigat!')
        .setColor('#eb1010');
    else if (value == 1)
      endEmbed.setTitle(`${message.author.username} a câștigat!`)
        .setColor('#22e32f')
        .addField(`Rezultat:`, this.firstRow() + '\n' + this.secondRow() + '\n' + this.thirdRow());
    else if (value == 2)
      endEmbed.setTitle(`${mentionedMember.user.username} a câștigat!`)
        .setColor('#22e32f')
        .addField(`Rezultat:`, this.firstRow() + '\n' + this.secondRow() + '\n' + this.thirdRow());
    
    this.inGame = false;
    return message.channel.send(endEmbed);
  }

  waitForResponse(id) {
    message.channel.awaitMessages(msg => msg.author.id == id, {
      max: 1,
      time: 60000
    }).then(collected => {
      let number = collected.first().content;
      this.decision(number);
    }).catch(() => {
      this.gameOver(0);
    });
  }

  waitForAccept() {
    message.channel.awaitMessages(msg => msg.author.id == mentionedMember.user.id, {
      max: 1,
      time: 30000
    }).then(msg => {
      if (msg.first().content.toLowerCase() == 'da' || msg.first().content.toLowerCase() == 'yes') 
        this.table();
      else if (msg.first().content.toLowerCase() == 'nu' || msg.first().content.toLowerCase() == 'no')
        return message.channel.send(`${mentionedMember.user.username} a refuzat invitatia. Jocul s-a încheiat!`);
      else {
        this.waitForAccept();
        return message.channel.send(`Nu îti înteleg răspunsul!\nFolosește \`da / yes\` sau \`nu / no\`.`);
      }
    }).catch(() => {
      this.gameOver(0);
    });
  }
}

module.exports = tictactoeGame;