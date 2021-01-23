module.exports = {
  name: 'reload',
  args: true,
  execute(message, args) {
    if (message.author.id != '500403270888456214') return message.reply('nu poti folosi această comandă!');

    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.channel.send(`Nu există o comandă cu numele \`${commandName}\`!`);

    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      return message.channel.send(`Comanda \`${commandName}\` a fost reîncărcată cu succes!`);
    } catch (error) {
      console.log(error);
      return message.channel.send(`A apărut o eroare la reîncărcarea comenzii \`${command.name}\`!`);
    }
  }
};