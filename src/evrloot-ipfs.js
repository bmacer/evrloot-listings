const {getIpfsLinkForItem, getIpfsLinkForSoul, getIpfsLinkForCraftedItem} = require("./abi-interaction");
const linkWithoutIpfs = require("./ipfs-link-tools")

module.exports = {
  getItemMetadata,
  getSoulMetadata,
  getSoulChildrenMetadata,
  getSoulImage
}

async function getItemMetadata(tokenId, isCrafted) {
  let ipfsLink = isCrafted ? await getIpfsLinkForCraftedItem(tokenId) : await getIpfsLinkForItem(tokenId);
  if (ipfsLink === undefined) {
    throw Error(`No IPFS Link for Item ${tokenId} found`);
  }
  return await fetchAsync(`https://evrloot.myfilebase.com/ipfs/${linkWithoutIpfs(ipfsLink)}`);
}

async function getSoulMetadata(soulId) {
  const soul = await fetchAsync(`https://api.evrloot.xyz/api/evmnfts/EVR-SOULS-${soulId}`);
  return await mapMetadataToSoul(soul, soulId);
}

async function mapMetadataToSoul(soul, soulId) {
  const soulMetadataLink = await getIpfsLinkForSoul(soulId);
  const soulMetadata = await getFromIpfs(soulMetadataLink);
  return {...soul, retrievedMetadata: soulMetadata}
}

async function getSoulChildrenMetadata(children) {
  const childrenWithMetadata = children.map(child => getFromIpfs(child.metadataUri));

  return Promise.all(childrenWithMetadata)
}

async function getFromIpfs(ipfsLink) {
  return await fetchAsync(`https://evrloot.myfilebase.com/ipfs/${removeIpfsStuff(ipfsLink)}`);
}

function removeIpfsStuff(ipfsLink) {
  let linkWithoutIpfs = ipfsLink.replace("ipfs://", "");
  if (linkWithoutIpfs.startsWith("ipfs/")) {
    linkWithoutIpfs = linkWithoutIpfs.replace("ipfs/", "");
  }
  return linkWithoutIpfs
}

async function getSoulImage(soulId) {
  const soulImageUrl = `https://api.evrloot.xyz/api/dynamic/evr-souls/${soulId}`
  console.log(soulImageUrl);
  return await fetchAsyncImage(soulImageUrl);
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

async function fetchAsyncImage(url) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return response.arrayBuffer()
  }).then(arrayBuffer => {
    return Buffer.from(arrayBuffer)
  }).catch(error => console.log(error))
}



