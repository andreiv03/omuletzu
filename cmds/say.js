module.exports = {
  name: 'say',
  description: `Pune-l pe Omuletzu' să citeze o frază aleasă de tine!`,
  color: '#f0549d',
  usage: '<orice frază>',
  cooldown: 5,
  guildOnly: true,
  execute(message, args) {
    message.channel.bulkDelete(1, true).catch(error => console.log(error));

    if (!args[0]) return message.reply('trebuie să spui ceva!');
    if (message.mentions.everyone) return message.reply('nu poti mentiona un rol!');

    const channels = message.mentions.channels.first();
    if (channels) return message.reply('nu poti mentiona un canal!');

    const roles = message.mentions.roles.first();
    if (roles) return message.reply('nu poti mentiona un rol!');

    let title = `**${message.author.tag} a spus:**\n"`;
    let text = args.join(' ') + '"';
    title += text;

    return message.channel.send(title); 
  }
}