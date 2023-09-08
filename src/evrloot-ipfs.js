const {getIpfsLinkForItem, getIpfsLinkForSoul, getIpfsLinkForCraftedItem} = require("./abi-interaction");
const linkWithoutIpfs = require("./ipfs-link-tools")

module.exports = {
  getItemMetadata,
  getSoulMetadata
}

async function getItemMetadata(tokenId, isCrafted) {
  let ipfsLink = isCrafted ? await getIpfsLinkForItem(tokenId) : await getIpfsLinkForCraftedItem(tokenId);
  if (ipfsLink === undefined) {
    throw Error(`No IPFS Link for Item ${tokenId} found`);
  }
  return await fetchAsync(`https://evrloot.myfilebase.com/ipfs/${linkWithoutIpfs(ipfsLink)}`);
}

async function getSoulMetadata(tokenId) {
  const ipfsLink = await getIpfsLinkForSoul(tokenId);
  // no idea what happens when the ipfs soul link is not found with the Contract, but that shouldn't happen eitherway
  // if (ipfsLink === undefined) {
  //   throw Error(`No IPFS Link for Item ${tokenId} found`);
  // }
  return await fetchAsync(`https://evrloot.myfilebase.com/ipfs/${linkWithoutIpfs(ipfsLink)}`);
}


async function fetchAsync(url) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return response.json()
  }).then(json => {
    return json
  }).catch(error => console.log(error))
}