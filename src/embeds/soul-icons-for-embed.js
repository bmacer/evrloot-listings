module.exports = {
  getSoulIconForClassName
}

const soulClassEmoteMap = new Map([
  ['Berserker', '<:berserker_logo:1276288005245632522>'],
  ['Alchemist', '<:alchemist_logo:1276288001990725665>'],
  ['Ranger', '<:ranger_logo:1276288006793330708>'],
  ['Behemoth', '<:behemoth_logo:1276288003844866151>'],
  ['Sandshaper', '<:sandshaper_logo:1276288000740823194>'],
]);

function getSoulIconForClassName(soulClass) {
  return soulClassEmoteMap.get(soulClass);

}