const fs = require('fs');

module.exports = {
  name: 'prefix',
  description: 'Schimbă prefixul bot-ului pentru acest server.',
  color: '#f55656',
  usage: '<noul prefix>',
  permissions: ['Manage Server'],
  cooldown: 15,
  args: true,
  guildOnly: true,
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD'))
      return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', 'utf8'));
    
    if (prefixes[message.guild.id].prefixes == args[0]) return message.reply(`nu este nevoie să modifici prefixul! Acesta este deja \`${args[0]}\`.`);

    prefixes[message.guild.id] = {
      prefixes: args[0]
    };

    fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (error) => {
      if (error) console.log(error);
    });
    
    return message.channel.send(`Comanda a fost executată cu succes!\nNoul prefix al bot-ului <@747112444253700147> este \`${args[0]}\`.`);
  }
};