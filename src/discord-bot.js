const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, IntentsBitField } = require('discord.js');

module.exports = {
  setupDiscordBot,
  postSpecificID,
  postSale
};

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });

async function setupDiscordBot() {
  await deployCommandsToServer();

  client.commands = getCollectionForCommands();

  client.once('ready', () => {
    console.log('Ready!');
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      console.log('');
      console.log('##############################  COMMAND  #############################');
      console.log(' User: ' + interaction.member.user.username + ' CommandName: ' + interaction.commandName + ' ID:' + interaction.commandId);
      console.log('######################################################################');
      await command.execute(interaction);
    }
    catch (error) {
      console.log('There was an error while executing this command!');
      console.error(error);
      // await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    console.log('############################  COMMAND END  ###########################');

  });

  await client.login(process.env.DISCORDJS_TOKEN);
}

async function deployCommandsToServer() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
  const rest = new REST().setToken(process.env.DISCORDJS_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENTID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  }
  catch (error) {
    console.error(error);
  }
}

function getCollectionForCommands() {
  const collection = new Collection();

  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    collection.set(command.data.name, command);
  }

  return collection;
}

async function postSpecificID(id, type) {
  let embed;
  if (type === 'Pirate') {
    embed = createListingEmbed(await dataComposer.getPirate(id));
  }
  else if (type === 'Flagship') {
    embed = createListingEmbed(await dataComposer.getFlagship(id));
  }
  postListing(embed);
}

async function postListing(embed) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const channel = guild.channels.cache.get(process.env.LISTINGS_CHANNEL_ID);

  await channel.send({ embeds: [embed] });
}

async function postSale(id, type, price) {
  const collectionTypes = ['Pirate', 'Flagship', 'Artefact']
  if (!collectionTypes.includes(type)) {
    return;
  }

  const embed = createSalesEmbed(id, type, price);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const channel = guild.channels.cache.get(process.env.SALES_CHANNEL_ID);

  await channel.send({ embeds: [embed] });
}