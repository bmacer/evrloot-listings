const {getIpfsLinkForItem} = require("./abi-interaction");
module.exports = {
  getItemMetadata
}

async function getItemMetadata(tokenId) {
  const ipfsLink = await getIpfsLinkForItem(tokenId);
  if (ipfsLink === undefined) {
    throw Error(`No IPFS Link for Item ${tokenId} found`);
  }
  const ipfsWithoutPrefix = ipfsLink.replace("ipfs://", "");
  return await fetchAsync(`https://evrloot.mypinata.cloud/ipfs/${ipfsWithoutPrefix}`);
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