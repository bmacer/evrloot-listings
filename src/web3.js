const Web3 = require('web3');
const { decodeInput } = require('./publish-listing.js')

module.exports = {
  setupWeb3Subscription
}

function setupWeb3Subscription() {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('wss://moonbeam.blastapi.io/3f7856cf-73cf-489e-9973-0daafbd333a6', {
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000,
      },
      reconnect: {
        auto: true,
        delay: 2500,
        onTimeout: true,
      },
    })
  );

  web3.eth.subscribe('logs', {
    address: '0xdF5499A17D487345e0201aCE513b26E5F427A717',
    fromBlock: 'latest'
  }, function(error, result){
    if (error)
      console.log(error);
    if (!error)
      console.log('received tx!')
      web3.eth.getTransaction(result.transactionHash).then(tx => {
        console.log('found transaction with input:', tx.input)

        const input = tx.input;
        if (input.startsWith('0xfecb1242')) {
          console.log('decoding input:', input)

          decodeInput(input)
        }

      })
  });


}
