const Discord = require('discord.js');

module.exports = async (client, messages) => {
  const bulkEmbed = new Discord.MessageEmbed()
    .setTitle('Mesaje șterse de la:')
    .setColor('#f55656')
    .setFooter('Acest mesaj se va șterge automat după 5 secunde.')

  let description = '', users = [], channel = messages.first().channel;

  messages.map(msg => {
    function checkUser(user) {
      return user.userID == msg.author.id;
    }

    if (users.find(checkUser)) {
      const index = users.findIndex(function (user) {
        return user.userID == msg.author.id;
      }); 
      users[index].number++;
    } else {
      users.push({
        userID: msg.author.id,
        number: 1
      });
    }
  });
  
  for (const user of users) {
    description += `**${channel.guild.members.cache.get(user.userID).user.tag}:** ${user.number >= 20 ? user.number + ' de' : user.number} ${user.number == 1 ? ' mesaj șters' : ' mesaje șterse'}\n`;
  }

  if (description) bulkEmbed.setDescription(description);
  return channel.send(bulkEmbed).then(msg => msg.delete({ timeout: 5000 })).catch(error => console.error(error));
};