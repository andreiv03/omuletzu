module.exports = {
  name: 'say',
  description: `Pune-l pe Omuletzu' să citeze o frază aleasă de tine!`,
  color: '#f0549d',
  usage: '<orice frază>',
  cooldown: 10,
  guildOnly: true,
  execute(message, args) {
    if (!args[0]) return message.reply('trebuie să spui ceva!');
    if (message.mentions.everyone) return message.reply('nu poti mentiona un rol!');

    const roles = message.mentions.roles.first();
    if (roles) return message.reply('nu poti mentiona un rol!');

    message.channel.bulkDelete(1, true).catch(error => console.log(error));

    let title = `**${message.author.tag} a spus:**\n"`;
    let text = args.join(' ') + '"';
    title += text;

    return message.channel.send(title); 
  }
}