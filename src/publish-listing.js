const { postListing } = require('./discord-bot.js')

module.exports = {
  decodeInput
}

function decodeInput(input) {
  postListing(input)
}