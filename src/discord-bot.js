
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

  });

  await client.login('MTEyMTQ4OTA2MTExNTMzODc3Mw.GA-Hbm.BYuakhB5klPo4DNQm1dUpFFa1COZtevZl6bNfo');
}

async function postListing(embed) {
  await client.guilds.fetch();
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  await guild.channels.fetch();
  const channel = guild.channels.cache.get(process.env.LISTINGS_CHANNEL_ID);

  await channel.send({embeds: [embed]});
}
