const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
  name: 'weather',
  description: 'Afișează detalii despre vremea dintr-o zonă a lumii.',
  color: '#fcc95e',
  usage: '<zonă>',
  cooldown: 5,
  args: true,
  execute(message, args) {
    let area = args[0], k = 1;
    while (args[k]) {
      area += ' ' + args[k];
      k++;
    }

    weather.find({ search: area, degreeType: 'C' }, function(error, result) {
      if (error || result === undefined || result.length === 0)
        return message.reply('nu cunosc această zonă.');
      
      let current = result[0].current;
      let location = result[0].location;

      let sign = '';
      if (location.timezone > 0) sign = '+';

      let color;
      if (current.temperature <= 0) color = '#3592f0';
      else if (current.temperature <= 10) color = '#31d5eb';
      else if (current.temperature <= 20) color = '#ebcc31';
      else if (current.temperature <= 30) color = '#eb8831';
      else color = '#e81c1c';

      const embed = new Discord.MessageEmbed()
        .setAuthor(current.observationpoint)
        .setDescription(`${current.day}, ${current.observationtime}\n${current.skytext}, \`${current.temperature}°\``)
        .setThumbnail(current.imageUrl)
        .setColor(color);
      
      embed.addField('Umiditate:', `${current.humidity}%`, true)
        .addField('Vânturi:', current.winddisplay, true)
        .addField('Fus orar:', `UTC ${sign}${location.timezone}`, true);
      return message.channel.send(embed);
    });
  }
};