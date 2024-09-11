require("dotenv").config();
const { setupDiscordBot } = require("./discord-bot.js");
const web3 = require("./web3.js");
const { decodeInput } = require("./publish-listing");
const { RMRK_MARKETPLACE } = require("./abi-interaction");
const { publishSale } = require("./publish-sale");

async function main() {
  // Wait for the client to be set up
  const client = await setupDiscordBot();

  const listingsChannelId = process.env.LISTINGS_CHANNEL_ID;
  const channel = client.channels.cache.get(listingsChannelId);
  if (channel) {
    await channel.send("Bot is now running and ready to process events!");
  } else {
    console.error(`Could not find channel with ID ${listingsChannelId}`);
  }

  web3.eth.subscribe(
    "logs",
    {
      address: "0xdF5499A17D487345e0201aCE513b26E5F427A717",
      fromBlock: "latest",
    },
    function (error, result) {
      if (error) console.log(error);
      if (!error)
        web3.eth.getTransaction(result.transactionHash).then(async (tx) => {
          const input = tx.input;
          if (input.startsWith("0xfecb1242")) {
            await decodeInput(input);
          }
        });
    }
  );

  RMRK_MARKETPLACE.events
    .NewSale({ fromBlock: "latest" })
    .on("connected", function (_subscriptionId) {
      console.log("connected to contract for new sales!");
    })
    .on("data", function (event) {
      publishSale(event);
    })
    .on("error", function (error, receipt) {
      console.log("Error:", error, receipt);
    });

  RMRK_MARKETPLACE.events
    .NewBid({ fromBlock: "latest" })
    .on("connected", function (_subscriptionId) {
      console.log("connected to contract for new bids!");
    })
    .on("data", function (event) {
      publishSale(event);
    })
    .on("error", function (error, receipt) {
      console.log("Error:", error, receipt);
    });
}

main().catch(console.error);
