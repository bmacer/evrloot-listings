const { Client, GatewayIntentBits } = require("discord.js");

module.exports = {
  setupDiscordBot,
  postListing,
  postListingWithImage,
};

let client;

async function setupDiscordBot() {
  require("dotenv").config({ path: "../.env" });

  client = new Client({ intents: [GatewayIntentBits.Guilds] });

  return new Promise((resolve) => {
    client.once("ready", () => {
      console.log("Ready!");
      resolve(client);
    });

    client.login(process.env.DISCORDJS_TOKEN);
  });
}

async function postListing(embed) {
  await client.guilds.fetch();
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  await guild.channels.fetch();
  const channel = guild.channels.cache.get(process.env.LISTINGS_CHANNEL_ID);

  await channel.send({ embeds: [embed] });
}

async function postListingWithImage(embed, file) {
  await client.guilds.fetch();
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  await guild.channels.fetch();
  const channel = guild.channels.cache.get(process.env.LISTINGS_CHANNEL_ID);

  await channel.send({ embeds: [embed], files: [file] });
}
