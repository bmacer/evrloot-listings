const SOUL_COLLECTION = '9d1454e198f4b601bfc0069003045b0cbc0e6749'

module.exports = function createSoulEmbed(id, soulMetadata, price, paymentOption) {
  return {
    color: 0xae1917,
    title: `Soul *${soulMetadata["name"]}*`,
    url: `https://singular.app/collectibles/moonbeam/${SOUL_COLLECTION}/${id}`,
    author: {
      name: 'New Soul Listed!',
      icon_url: 'https://game.evrloot.com/assets/icons/moonbeamIcon.png',
    },
    description: `Soul listed for **${price} ${paymentOption}**`,
    fields: [
      {
        name: 'Stats',
        value: soulStatsFormatter(soulMetadata["attributes"]),
        inline: true
      },
      {
        name: 'Attributes',
        value: soulAttrFormatter(soulMetadata["attributes"]),
        inline: true
      }
    ],
  };
}

function soulAttrFormatter(attributes) {
  const soulClass = searchAttr(attributes, "Soul Class");
  const personality = searchAttr(attributes, "Personality");
  const talent = searchAttr(attributes, "Talent");
  const origin = searchAttr(attributes, "Origin");
  const condition = searchAttr(attributes, "Condition");

  let returnString = '';

  returnString += `*Soul Class*: ${soulClass["value"]}\n`;
  returnString += `*Personality*: ${personality["value"]}\n`;
  returnString += `*Talent*: ${talent["value"]}\n`;
  returnString += `*Origin*: ${origin["value"]}\n`;
  returnString += `*Condition*: ${condition["value"]}\n`;

  return returnString;
}

function soulStatsFormatter(attributes) {
  const strength = searchAttr(attributes, "Strength");
  const dexterity = searchAttr(attributes, "Dexterity");
  const intelligence = searchAttr(attributes, "Intelligence");
  const wisdom = searchAttr(attributes, "Wisdom");
  const fortitude = searchAttr(attributes, "Fortitude");
  const luck = searchAttr(attributes, "Luck");

  let returnString = '';

  returnString += `*Strength*: ${strength["value"]}\n`;
  returnString += `*Dexterity*: ${dexterity["value"]}\n`;
  returnString += `*Intelligence*: ${intelligence["value"]}\n`;
  returnString += `*Wisdom*: ${wisdom["value"]}\n`;
  returnString += `*Fortitude*: ${fortitude["value"]}\n`;
  returnString += `*Luck*: ${luck["value"]}\n`;

  return returnString;
}

function searchAttr(attributes, attributeName) {
  return attributes.find(attr => attr["label"] === attributeName)
}