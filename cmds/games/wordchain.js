const Discord = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
  name: 'wordchain',
  description: `Configurează setările necesare functionării jocului fazan. Dacă nu selectezi nicio optiune, vor fi afișate toate informatiile acestui joc.\nOptiuni disponibile: \`channel (se crează un canal special)\``,
  color: '#3beb72',
  usage: '<optiune>',
  cooldown: 5,
  guildOnly: true,
  async execute(message, args) {
    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error); 
    });

    if (!args[0]) {
      let channel = message.guild.channels.cache.get(guildSettings.wordChainChannelID);
      let currentWord = guildSettings.wordChainCurrentWord;
      let currentWinner = guildSettings.wordChainCurrentWinner;

      const infoEmbed = new Discord.MessageEmbed()
        .setColor('#3beb72')
        .addField('Setările jocului:', `**Canal setat:** ${channel ? channel : 'N/A'}\n`)
        .addField('Informatii suplimentare:', `**Ultimul cuvânt:** ${currentWord ? currentWord : 'N/A'}\n**Ultimul câștigător:** ${currentWinner ? currentWinner : 'N/A'}`)

      return message.channel.send(infoEmbed);
    } else if (args[0].toLowerCase() == 'channel') {
      if (!guildSettings.wordChainChannelID) {
        await message.guild.channels.create('word-chain', {
          type: 'text',
          rateLimitPerUser: '5'
        }).then(async channel => {
          await guildSettings.updateOne({
            wordChainChannelID: channel.id
          }).catch(error => console.error(error));
    
          channel.send('')
          return message.channel.send(`Canalul **${channel}** a fost creat cu succes!`);
        }).catch(error => console.error(error));
      } else return message.channel.send(`Ca să creezi alt canal pentru jocul fazan, trebuie să-l ștergi pe cel actual!\nCanalul actual este ${message.guild.channels.cache.get(guildSettings.wordChainChannelID)}`);
    }
  }
};