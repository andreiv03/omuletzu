const Guild = require('../../models/guild');

module.exports = {
  name: 'prefix',
  description: `Schimbă prefixul lui Omuletzu' pe acest server.`,
  color: '#f55656',
  usage: '<noul prefix>',
  permissions: ['Administrator'],
  cooldown: 15,
  guildOnly: true,
  async execute(message, args) {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const settings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });

    if (!args[0]) return message.reply(`trebuie să specifici noul prefix!`);
    if (args[0] == settings.prefix) return message.reply(`trebuie să alegi un prefix diferit!`);
    if (args[0].length > 3) return message.reply(`prefixul introdus este mult prea lung. Poti folosi maxim 3 caractere!`);

    await settings.updateOne({
      prefix: args[0]
    }).catch(error => console.error(error));

    return message.channel.send(`Comanda a fost executată cu succes!\nNoul prefix al lui <@747112444253700147> este \`${args[0]}\``);
  }
};