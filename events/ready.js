const prefix = process.env.PREFIX;

module.exports = client => {
  console.log(`Omuletzu' is online in ${client.guilds.cache.size} servers!`);
  
  let status = `${prefix}help | ${prefix}invite | ${client.guilds.cache.size} servers`;
  client.user.setActivity(status, { type: 'PLAYING' });
}