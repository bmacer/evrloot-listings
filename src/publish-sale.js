const { postListing } = require('./discord-bot.js')
const { getItemMetadata, getSoulMetadata } = require("./evrloot-ipfs");
const createSoulSalesEmbed = require('./embeds/sales/soul-embed')
const createItemSalesEmbed = require('./embeds/sales/item-embed')
const { getPriceOfRmrk, getPriceOfGlmr } = require("./fetch-prices");

const RMRK_CONTRACT_ADDRESS = '0xecf2adaff1de8a512f6e8bfe67a2c836edb25da3'
const WGLMR_CONTRACT_ADDRESS = '0xacc15dc74880c9944775448304b263d191c6077f'

const SOUL_COLLECTION = '0x9d1454e198f4b601bfc0069003045b0cbc0e6749'
const ITEM_COLLECTION = '0x29b58a7fceecf0c84e62301e5b933416a1db0599'

module.exports = {
    publishSale
}

async function publishSale(event) {
    console.log('publish direct sale')
    console.log('event', event)
    const id = event.returnValues.tokenId;
    const collection = event.returnValues.tokenAddress;
    const paymentOption = event.returnValues.currency;
    const priceInGwei = event.returnValues.totalPricePaid //price in hex rmrk: 10decimals, gmlr: 18 decimals
    console.log('id', id)
    console.log('collection', collection)
    console.log('paymentOption', paymentOption)
    console.log('priceInGwei', priceInGwei)

    let power = 0;
    if (paymentOption === RMRK_CONTRACT_ADDRESS) {
        power = 10
    } else if (paymentOption === WGLMR_CONTRACT_ADDRESS) {
        power = 18
    }
    const readablePrice = Math.round((priceInGwei / Math.pow(10, power)) * 100) / 100

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

    if (collection === SOUL_COLLECTION) {
        const soulMetadata = await getSoulMetadata(id);
        await postListing(createSoulSalesEmbed(id, soulMetadata, readablePrice, paymentOptionText, usdPrice))
    } else if (collection === ITEM_COLLECTION) {
        const itemMetadata = await getItemMetadata(id);
        await postListing(createItemSalesEmbed(id, itemMetadata, readablePrice, paymentOptionText, usdPrice))
    }

}