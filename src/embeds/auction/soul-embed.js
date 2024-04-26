const SOUL_COLLECTION = '0x9d1454e198f4b601bfc0069003045b0cbc0e6749'

module.exports = function createSoulEmbed(soul, soulChildren, startingPrice, paymentOption, usdPrice, startTime, endTime, imageName) {
  return {
    color: 0xae1917,
    title: `Soul *${soul.retrievedMetadata.name}*`,
    url: `https://singular.app/collectibles/moonbeam/${SOUL_COLLECTION}/${soul.tokenId}`,
    author: {
      name: 'New Auction on Soul!',
      icon_url: 'https://game.evrloot.com/assets/icons/moonbeamIcon.png',
    },
    description: `Starting price: **${startingPrice} ${paymentOption} (${usdPrice}$)**\n` +
                 `Auction started at: <t:${startTime}:f>\n` +
                 `Ending: <t:${endTime}:f> (<t:${endTime}:R>)`,
    fields: [
      {
        name: 'Stats',
        value: soulStatsFormatter(soul.retrievedMetadata.attributes),
        inline: true
      },
      {
        name: 'Attributes',
        value: soulAttrFormatter(soul.retrievedMetadata.attributes),
        inline: true
      },
      {
        name: 'Experience',
        value: soulExperienceFormatter(soul.experience.activities),
        inline: true
      },
      {
        name: 'Children',
        value: soulChildsFormatter(soulChildren),
        inline: true
      }
    ],
    image: {
      url: `attachment://${imageName}`
    },
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


const shownExperiences = [1, 2, 3, 4, 6, 7]
function soulExperienceFormatter(experiences) {
  const expStrings = experiences
    .filter(exp => shownExperiences.includes(exp.activityId))
    .map(getExpString)

  let returnString = '';

  expStrings.forEach(expString => returnString += expString)

  return returnString;
}

function getExpString(exp) {
  return `*${exp.activityName}*: ${exp.experience}\n`
}

function soulChildsFormatter(childrenMetadata) {
  let returnString = '';
  childrenMetadata
    .sort(raritySorter)
    .forEach(child => returnString += `[${searchAttr(child.attributes, "Rarity").value}] *${child.name}*\n`)

  return returnString;
}

const raritySortValue = new Map([
  ['Common', 0],
  ['Rare', 1],
  ['Epic', 2],
  ['Legendary', 3],
])
function raritySorter(entryA, entryB) {
  const rarityA = searchAttr(entryA.attributes, "Rarity").value;
  const rarityB = searchAttr(entryB.attributes, "Rarity").value;

  return raritySortValue.get(rarityA) - raritySortValue.get(rarityB)
}

function searchAttr(attributes, attributeName) {
  return attributes.find(attr => attr["label"] === attributeName)
}