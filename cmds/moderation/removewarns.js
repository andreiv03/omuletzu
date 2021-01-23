const Discord = require('discord.js');
const Guild = require('../../models/guild');
const User = require('../../models/user');

module.exports = {
  name: 'removewarns',
  aliases: ['rwarns'],
  description: 'Scoate toate warn-urile existente în acest server.',
  color: '#f55656',
  permissions: ['Manage Server'],
  cooldown: 15,
  guildOnly: true,
  async execute(message) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const guildSettings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    const logsChannel = message.guild.channels.cache.get(guildSettings.logsChannelID);
    if (!logsChannel) return message.reply(`trebuie să setezi canalul pentru logs cu comanda \`${guildSettings.prefix}logschannel\` înainte de a sanctiona un membru!`);

    message.channel.send(`Ești sigur că vrei să ștergi toate warn-urile existente în acest server?\nScrie \`DA\` dacă ești de acord sau orice altceva în caz contrar.`);
    message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
      max: 1,
      time: 15000
    }).then(async collected => {
      let response = collected.first().content;

      if (response.toLowerCase() == 'da') {
        const users = await User.find({
          guildID: message.guild.id,
        }, async (error) => {
          if (error) console.error(error);
        });

        let k = 0;

        users.map(async user => {
          if (user.warns && user.warns.length > 0) {
            k = k + user.warns.length;
            const memberID = user.userID;
            
            await User.findOne({
              guildID: message.guild.id,
              userID: memberID
            }, async (error, user) => {
              if (error) console.error(error);
        
              user.updateOne({
                warns: []
              }).catch(error => console.error(error));
            });
          }
        });
  
        if (k) {
          await guildSettings.updateOne({
            cases: guildSettings.cases + 1
          }).catch(error => console.error(error));

          message.channel.send(`Toate warn-urile existente în acest server au fost scoase cu succes!`);
    
          const warnEmbed = new Discord.MessageEmbed()
            .setTitle(`Clear Server Warns | Cazul #${guildSettings.cases + 1}`)
            .setColor('#f55656')
            .setFooter(`ID SERVER: ${message.channel.guild.id}`)
            .setTimestamp(new Date())
            .setDescription(`**Număr de warn-uri șterse:**  ${k >= 20 ? k + ' de' : k} ${k == 1 ? ' warn șters' : ' warn-uri șterse'}\n**Moderator răspunzător:** ${message.author.tag}`);

          if (message.guild.iconURL()) 
            warnEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
          else warnEmbed.attachFiles(['./imgs/discord-logo.png']).setThumbnail('attachment://discord-logo.png');
    
          return logsChannel.send(warnEmbed);
        } else return message.reply('nu exista niciun warn în acest server!');
      }
    }).catch(error => console.error(error));
  }
};