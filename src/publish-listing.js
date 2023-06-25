const { postListing } = require('./discord-bot.js')
const {getItemMetadata, getSoulMetadata, getFishMetadata} = require("./evrloot-ipfs");
const createFishEmbed = require('./embeds/fish-embed')
const createSoulEmbed = require('./embeds/soul-embed')
const createItemEmbed = require('./embeds/item-embed')


const RMRK_CONTRACT_ADDRESS = 'ecf2adaff1de8a512f6e8bfe67a2c836edb25da3'
const WGLMR_CONTRACT_ADDRESS = 'acc15dc74880c9944775448304b263d191c6077f'

const FISH_COLLECTION = '95492edcc1d373e236e368973285ad47d56d07b6'
const SOUL_COLLECTION = '9d1454e198f4b601bfc0069003045b0cbc0e6749'
const ITEM_COLLECTION = '29b58a7fceecf0c84e62301e5b933416a1db0599'

module.exports = {
  decodeInput
}

async function decodeInput(input) {
  console.log('started decoding');

  const hexId = input.substring(130, 130 + 8);
  const collection = input.substring(482, 482 + 40)
  const paymentOption = input.substring(546, 546 + 40).toLowerCase()
  const hexPrice = input.substring(362, 362 + 32) //price in hex rmrk: 10decimals, gmlr: 18 decimals

  const id = parseInt(hexId, 16);
  const priceInGwei = parseInt(hexPrice, 16);

  let power = 0;
  if (paymentOption === RMRK_CONTRACT_ADDRESS) {
    power = 10
  } else if (paymentOption === WGLMR_CONTRACT_ADDRESS) {
    power = 18
  }
  const readablePrice = priceInGwei / Math.pow(10, power)

  let paymentOptionText;
  switch (paymentOption) {
    case RMRK_CONTRACT_ADDRESS:
      paymentOptionText = "xcRMRK";
      break;
    case WGLMR_CONTRACT_ADDRESS:
      paymentOptionText = "WGLMR";
      break;
    default:
      paymentOptionText = "[missing contract address]"
  }

  if (collection === FISH_COLLECTION) {
    const fishMetadata = await getFishMetadata(id);
    await postListing(createFishEmbed(id, fishMetadata, readablePrice, paymentOptionText));
  } else if (collection === SOUL_COLLECTION) {
    const soulMetadata = await getSoulMetadata(id);
    await postListing(createSoulEmbed(id, soulMetadata, readablePrice, paymentOptionText));
  } else if (collection === ITEM_COLLECTION) {
    const itemMetadata = await getItemMetadata(id);
    await postListing(createItemEmbed(id, itemMetadata, readablePrice, paymentOptionText));
  }

}