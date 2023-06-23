
const { Client } = require('discord.js');

module.exports = {
  setupDiscordBot,
  postListing,
};

const client = new Client({intents: 0});

async function setupDiscordBot() {
  require('dotenv').config();
  client.once('ready', () => {
    console.log('Ready!');

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get('1121489416209322075');

    console.log(guild.members.cache)
    client.guilds.fetch().then(() => {
      console.log("guilds:", client.guilds.cache)
      guild.channels.fetch().then(() => {
        console.log(guild.channels.cache)
      })
    })
  });

  await client.login('MTEyMTQ4OTA2MTExNTMzODc3Mw.GA-Hbm.BYuakhB5klPo4DNQm1dUpFFa1COZtevZl6bNfo');
}

async function postListing(embed) {
  await client.guilds.fetch();
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  await guild.channels.fetch();
  const channel = guild.channels.cache.get('1121489416209322075');

  await channel.send(embed);
}
