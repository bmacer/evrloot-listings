const web3 = require("./web3");
const {publishSale} = require('./publish-sale')

module.exports = {
  setupAuctionAndSalesSubscriptions,
  getIpfsLinkForItem,
  getIpfsLinkForSoul,
  getIpfsLinkForFish
}

const ABI_EVRLOOT_ITEMS = require('./abi/ABI_EVRLOOT_ITEMS.json');
const CONTRACT_ADDRESS_EVRLOOT_ITEMS = '0x29b58A7fCeecF0C84e62301E5b933416a1DB0599';
const EVRLOOT_ITEMS = new web3.eth.Contract(ABI_EVRLOOT_ITEMS, CONTRACT_ADDRESS_EVRLOOT_ITEMS);

const ABI_EVRLOOT_SOULS = require('./abi/ABI_EVRLOOT_SOULS.json');
const CONTRACT_ADDRESS_EVRLOOT_SOULS = '0x9D1454e198F4b601BfC0069003045b0CBC0e6749';
const EVRLOOT_SOULS = new web3.eth.Contract(ABI_EVRLOOT_SOULS, CONTRACT_ADDRESS_EVRLOOT_SOULS);

const ABI_EVRLOOT_FISH = require('./abi/ABI_EVRLOOT_FISH.json');
const CONTRACT_ADDRESS_EVRLOOT_FISH = '0x95492edcc1d373e236e368973285ad47d56d07b6';
const EVRLOOT_FISH = new web3.eth.Contract(ABI_EVRLOOT_FISH, CONTRACT_ADDRESS_EVRLOOT_FISH);

const ABI_RMRK_MARKETPLACE = require('./abi/ABI_RMRK_MARKETPLACE.json');
const CONTRACT_ADDRESS_RMRK_MARKETPLACE = '0xdF5499A17D487345e0201aCE513b26E5F427A717';
const RMRK_MARKETPLACE = new web3.eth.Contract(ABI_RMRK_MARKETPLACE, CONTRACT_ADDRESS_RMRK_MARKETPLACE);

function setupAuctionAndSalesSubscriptions() {
  RMRK_MARKETPLACE.events.NewSale(({fromBlock: 'latest'})
    .on("connected", function(_subscriptionId){
      console.log('connected to contract for new sales!');
    })
    .on('data', function(event){
      publishSale(event)
    })
    .on('error', function(error, receipt) {
      console.log('Error:', error, receipt);
    })
  );
}
async function getIpfsLinkForItem(tokenId) {
  const activeAssetsForTokenId = await EVRLOOT_ITEMS.methods.getActiveAssets(tokenId).call();

  if (activeAssetsForTokenId.length > 0) {
    return await EVRLOOT_ITEMS.methods.getAssetMetadata(tokenId, activeAssetsForTokenId[0]).call();
  }

  return undefined;
}

async function getIpfsLinkForSoul(tokenId) {
  return await EVRLOOT_SOULS.methods.getAssetMetadata(tokenId, tokenId).call();
}

async function getIpfsLinkForFish(tokenId) {
  const activeAssetsForTokenId = await EVRLOOT_FISH.methods.getActiveAssets(tokenId).call();

  if (activeAssetsForTokenId.length > 0) {
    return await EVRLOOT_FISH.methods.getAssetMetadata(tokenId, activeAssetsForTokenId[0]).call();
  }

  return undefined;
}