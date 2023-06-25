const removeIpfsStuff = require("../ipfs-link-tools");

const ITEM_COLLECTION = '29b58a7fceecf0c84e62301e5b933416a1db0599'

module.exports = function createItemEmbed(id, itemMetadata, price, paymentOption) {
  return {
    color: 0x1f8724,
    title: `Item *${itemMetadata["name"]}*`,
    url: `https://singular.app/collectibles/moonbeam/${ITEM_COLLECTION}/${id}`,
    author: {
      name: 'New Item Listed!',
      icon_url: 'https://game.evrloot.com/assets/icons/moonbeamIcon.png',
    },
    description: `Item listed for **${price} ${paymentOption}**`,
    thumbnail: {
      url: `https://evrloot.mypinata.cloud/ipfs/${removeIpfsStuff(itemMetadata["image"])}`,
    },
    fields: [
      {
        name: 'Attributes',
        value: itemAttrFormatter(itemMetadata["attributes"]),
        inline: true
      },
      {
        name: 'Stats',
        value: itemStatsFormatter(itemMetadata["attributes"]),
        inline: true
      }
    ],
  };
}

function itemAttrFormatter(attributes) {
  const soulClass = searchAttr(attributes, "Soul Class");
  const rarity = searchAttr(attributes, "Rarity");
  const slot = searchAttr(attributes, "Slot");
  const itemClass = searchAttr(attributes, "Item Class");

  let returnString = '';

  if (soulClass !== undefined) returnString += `*For Class*: ${soulClass["value"]}\n`;
  if (rarity !== undefined) returnString += `*Rarity*: ${rarity["value"]}\n`;
  if (slot !== undefined) returnString += `*Slot*: ${slot["value"]}\n`;
  if (itemClass !== undefined) returnString += `*Item Class*: ${itemClass["value"]}\n`;

  return returnString;
}

function itemStatsFormatter(attributes) {
  const strength = searchAttr(attributes, "Strength");
  const dexterity = searchAttr(attributes, "Dexterity");
  const intelligence = searchAttr(attributes, "Intelligence");
  const wisdom = searchAttr(attributes, "Wisdom");
  const fortitude = searchAttr(attributes, "Fortitude");
  const luck = searchAttr(attributes, "Luck");
  const armor = searchAttr(attributes, "Armor");
  const minDmg = searchAttr(attributes, "MinDamage");
  const maxDmg = searchAttr(attributes, "MaxDamage");
  const fishing = searchAttr(attributes, "Fishing");

  let returnString = '';

  if (strength !== undefined) returnString += `*Strength*: ${strength["value"]}\n`;
  if (dexterity !== undefined) returnString += `*Dexterity*: ${dexterity["value"]}\n`;
  if (intelligence !== undefined) returnString += `*Intelligence*: ${intelligence["value"]}\n`;
  if (wisdom !== undefined) returnString += `*Wisdom*: ${wisdom["value"]}\n`;
  if (fortitude !== undefined) returnString += `*Fortitude*: ${fortitude["value"]}\n`;
  if (luck !== undefined) returnString += `*Luck*: ${luck["value"]}\n`;
  if (armor !== undefined) returnString += `*Armor*: ${armor["value"]}\n`;
  if (minDmg !== undefined) returnString += `*Min Damage*: ${minDmg["value"]}\n`;
  if (maxDmg !== undefined) returnString += `*Max Damage*: ${maxDmg["value"]}\n`;
  if (fishing !== undefined) returnString += `*Fishing*: ${fishing["value"]}\n`;

  return returnString;
}

function searchAttr(attributes, attributeName) {
  return attributes.find(attr => attr["label"] === attributeName)
}