module.exports = {
  getPriceOfGlmr,
  getPriceOfRmrk
}

async function getPriceOfGlmr(amount) {
  const glmrPrice = await fetchAsync('https://api.coingecko.com/api/v3/simple/price?ids=moonbeam&vs_currencies=usd')
  return glmrPrice.moonbeam.usd * amount;
}

async function getPriceOfRmrk(amount) {
  const rmrkPrice = await fetchAsync('https://api.coingecko.com/api/v3/simple/price?ids=rmrk&vs_currencies=usd')
  return rmrkPrice.rmrk.usd * amount;
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