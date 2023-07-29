const { postListing } = require('./discord-bot.js')
const {getItemMetadata, getSoulMetadata, getFishMetadata} = require("./evrloot-ipfs");
const createFishListingEmbed = require('./embeds/listing/fish-embed')
const createSoulListingEmbed = require('./embeds/listing/soul-embed')
const createItemListingEmbed = require('./embeds/listing/item-embed')
const createFishAuctionEmbed = require('./embeds/auction/fish-embed')
const createSoulAuctionEmbed = require('./embeds/auction/soul-embed')
const createItemAuctionEmbed = require('./embeds/auction/item-embed')
const {getPriceOfRmrk, getPriceOfGlmr} = require("./fetch-prices");

const RMRK_CONTRACT_ADDRESS = 'ecf2adaff1de8a512f6e8bfe67a2c836edb25da3'
const WGLMR_CONTRACT_ADDRESS = 'acc15dc74880c9944775448304b263d191c6077f'

const FISH_COLLECTION = '95492edcc1d373e236e368973285ad47d56d07b6'
const SOUL_COLLECTION = '9d1454e198f4b601bfc0069003045b0cbc0e6749'
const ITEM_COLLECTION = '29b58a7fceecf0c84e62301e5b933416a1db0599'

module.exports = {
  decodeInput
}

async function decodeInput(input) {
  const id =  parseInt(input.substring(130, 130 + 8), 16);
  const collection = input.substring(482, 482 + 40)
  const paymentOption = input.substring(546, 546 + 40).toLowerCase()
  const priceInGwei = parseInt(input.substring(362, 362 + 32), 16); //price in hex rmrk: 10decimals, gmlr: 18 decimals
  const startingBidPriceInGwei = parseInt(input.substring(874, 874+32), 16);
  const startTime = parseInt(input.substring(186, 186+16), 16);
  const secondsUntilEndTime = parseInt(input.substring(258, 258+8), 16);
  const endTime = startTime + secondsUntilEndTime;

  let power = 0;
  if (paymentOption === RMRK_CONTRACT_ADDRESS) {
    power = 10
  } else if (paymentOption === WGLMR_CONTRACT_ADDRESS) {
    power = 18
  }
  const readablePrice = Math.round((priceInGwei / Math.pow(10, power)) * 100) / 100
  const readableStartingBidPrice = Math.round((startingBidPriceInGwei / Math.pow(10, power)) * 100) / 100

  let paymentOptionText;
  let usdPrice;
  switch (paymentOption) {
    case RMRK_CONTRACT_ADDRESS:
      paymentOptionText = "xcRMRK";
      readableStartingBidPrice > 0
        ? usdPrice = await getPriceOfRmrk(readableStartingBidPrice)
        : usdPrice = await getPriceOfRmrk(readablePrice);
      break;
    case WGLMR_CONTRACT_ADDRESS:
      paymentOptionText = "WGLMR";
      readableStartingBidPrice > 0
        ? usdPrice = await getPriceOfGlmr(readableStartingBidPrice)
        : usdPrice = await getPriceOfGlmr(readablePrice);
      break;
    default:
      paymentOptionText = "[missing contract address]"
      usdPrice = 0;
  }

  usdPrice = Math.round(usdPrice * 100) / 100


  if (collection === FISH_COLLECTION) {
    // const fishMetadata = await getFishMetadata(id);
    // readableStartingBidPrice > 0
    //   ? await postListing(createFishAuctionEmbed(id, fishMetadata, readableStartingBidPrice, paymentOptionText, usdPrice, startTime, endTime))
    //   : await postListing(createFishListingEmbed(id, fishMetadata, readablePrice, paymentOptionText, usdPrice))
  } else if (collection === SOUL_COLLECTION) {
    const soulMetadata = await getSoulMetadata(id);
    readableStartingBidPrice > 0
      ? await postListing(createSoulAuctionEmbed(id, soulMetadata, readableStartingBidPrice, paymentOptionText, usdPrice, startTime, endTime))
      : await postListing(createSoulListingEmbed(id, soulMetadata, readablePrice, paymentOptionText, usdPrice))
  } else if (collection === ITEM_COLLECTION) {
    const itemMetadata = await getItemMetadata(id);
    readableStartingBidPrice > 0
      ? await postListing(createItemAuctionEmbed(id, itemMetadata, readableStartingBidPrice, paymentOptionText, usdPrice, startTime, endTime))
      : await postListing(createItemListingEmbed(id, itemMetadata, readablePrice, paymentOptionText, usdPrice))
  }

}