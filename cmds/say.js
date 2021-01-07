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
    if (message.mentions.everyone) return message.reply('nu poti mentiona acest rol!');

    let title = '', k = Math.floor(Math.random() * 2);
    if (k == 0) title = `Ultimele cuvinte ale lui ${message.author.username} au fost:`;
    else if (k == 1) title = `Demult, pe un tărâm îndepărtat, eu, ${message.author.username}, am spus:`; 

    let text = `**` + title + ` **\n"`, i = 0;
    while (args[i]) {
      text += args[i] + ' ';
      i++;
    }
    text = text.slice(0, -1);
    text += `"`;

    return message.channel.send(text); 
  }
}