const { postListing } = require('./discord-bot.js')
const createSoulBidEmbed = require('./embeds/bid/soul-embed')
const createItemBidEmbed = require('./embeds/bid/item-embed')
const { getPriceOfRmrk, getPriceOfGlmr } = require("./fetch-prices");

const RMRK_CONTRACT_ADDRESS = '0xecf2adaff1de8a512f6e8bfe67a2c836edb25da3'
const WGLMR_CONTRACT_ADDRESS = '0xacc15dc74880c9944775448304b263d191c6077f'

const SOUL_COLLECTION = '0x9d1454e198f4b601bfc0069003045b0cbc0e6749'
const ITEM_COLLECTION = '0x29b58a7fceecf0c84e62301e5b933416a1db0599'

module.exports = {
  publishBid
}

async function publishBid(event) {
  console.log('publish bid')
  const listingId = event.returnValues.listingId;
  const paymentOption = event.returnValues.currency;
  const priceInGwei = event.returnValues.totalDirectOfferAmount; //price in hex rmrk: 10decimals, gmlr: 18 decimals
  const incentiveIfOutbid = event.returnValues.incentiveIfOutbid;

  console.log('listingId', listingId)
  console.log('incentiveIfOutbid', incentiveIfOutbid)
  console.log('paymentOption', paymentOption)
  console.log('priceInGwei', priceInGwei)

  let power = 0;
  if (paymentOption === RMRK_CONTRACT_ADDRESS) {
    power = 10
  } else if (paymentOption === WGLMR_CONTRACT_ADDRESS) {
    power = 18
  }
  const readablePrice = Math.round((priceInGwei / Math.pow(10, power)) * 100) / 100
  const readableIncentiveIfOutbid = Math.round((incentiveIfOutbid / Math.pow(10, power)) * 100) / 100

  let paymentOptionText;
  let usdPrice;
  switch (paymentOption) {
    case RMRK_CONTRACT_ADDRESS:
      paymentOptionText = "xcRMRK";
      usdPrice = await getPriceOfRmrk(readablePrice);
      break;
    case WGLMR_CONTRACT_ADDRESS:
      paymentOptionText = "WGLMR";
      usdPrice = await getPriceOfGlmr(readablePrice);
      break;
    default:
      paymentOptionText = "[missing contract address]"
      usdPrice = 0;
  }

  usdPrice = Math.round(usdPrice * 100) / 100

  // need to get listing information

  // if (collection === SOUL_COLLECTION) {
  //   await postListing(createSoulBidEmbed(listingId, readableIncentiveIfOutbid, paymentOptionText, usdPrice))
  // } else if (collection === ITEM_COLLECTION) {
  //   await postListing(createItemBidEmbed(listingId, readableIncentiveIfOutbid, paymentOptionText, usdPrice))
  // }

}