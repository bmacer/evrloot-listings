const removeIpfsStuff = require("../ipfs-link-tools");

const FISH_COLLECTION = '95492edcc1d373e236e368973285ad47d56d07b6'

module.exports = function createFishEmbed(id, fishMetadata, price, paymentOption) {
  return {
    color: 0x5cc5db,
    title: `*${fishMetadata["name"]}*`,
    url: `https://singular.app/collectibles/moonbeam/${FISH_COLLECTION}/${id}`,
    author: {
      name: 'New Fish Listed!',
      icon_url: 'https://game.evrloot.com/assets/icons/moonbeamIcon.png',
    },
    description: `Fish listed for **${price} ${paymentOption}**`,
    thumbnail: {
      url: `https://evrloot.mypinata.cloud/ipfs/${removeIpfsStuff(fishMetadata["thumbnailUri"])}`,
    },
    fields: [
      {
        name: 'Attributes',
        value: fishAttrFormatter(fishMetadata["attributes"]),
      }
    ]
  };
}

function fishAttrFormatter(attributes) {
  const rarity = searchAttr(attributes, "Rarity");
  const scale = searchAttr(attributes, "Scale");
  const caughtOn = searchAttr(attributes, "Caught On");

  let returnString = '';

  returnString += `*Rarity*: ${rarity["value"]}\n`;
  returnString += `*Scale*: ${scale["value"]}\n`;
  returnString += `*Caught On*: ${caughtOn["value"]}\n`;

  return returnString;
}

function searchAttr(attributes, attributeName) {
  return attributes.find(attr => attr["label"] === attributeName)
}