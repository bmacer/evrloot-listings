require('dotenv').config();
const { setupDiscordBot } = require("./discord-bot.js");
const { setupWeb3Subscription} = require("./web3.js");

setupDiscordBot();
setupWeb3Subscription();
