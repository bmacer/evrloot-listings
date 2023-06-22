require('dotenv').config();
const { setupDiscordBot } = require("./discord-bot.js");

const run = async () => {
  await setupDiscordBot()
  console.log("Init;")
}


run();