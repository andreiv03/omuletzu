module.exports = {
  name: 'clear',
  aliases: ['delete'],
  description: 'Șterge un număr de mesaje.',
  color: '#f55656',
  usage: '<număr de mesaje>',
  permissions: ['Manage Messages'],
  cooldown: 3,
  args: true,
  guildOnly: true,
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('nu ai permisiunile necesare pentru a folosi această comandă!');

    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount) || amount <= 1) {
      return message.reply('nu ai introdus un număr valid!');
    } else if (amount > 100) {
      return message.reply('poti șterge maxim 99 de mesaje deodată!');
    }

    message.channel.bulkDelete(amount, true).catch(error => {
      console.error(error);
      message.channel.send('Tocmai a apărut o eroare la rularea acestei comenzi. Mai încearcă o dată!');
    });
  }
};