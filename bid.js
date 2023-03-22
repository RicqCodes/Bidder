global.Headers = global.Headers || require("node-fetch").Headers;
const opensea = require("opensea-js");
require("dotenv").config();
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const HDWalletProvider = require("@truffle/hdwallet-provider");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_KEY = process.env.INFURA_API_KEY;
const TARGET_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const MY_ADDRESS = process.env.MY_ADDRESS;
const NETWORK = process.env.NETWORK;
// const API_KEY = process.env.OPENSEA_API_KEY;
const API_KEY = "";

// get the command line arguments
const args = process.argv.slice(2);

if (
  !PRIVATE_KEY ||
  !INFURA_KEY ||
  !NETWORK ||
  !MY_ADDRESS ||
  !TARGET_CONTRACT_ADDRESS
) {
  console.error(
    "Please set a mnemonic, infura key, user address, network, and target NFT contract address."
  );
  return;
}

const provider = new HDWalletProvider({
  privateKeys: [PRIVATE_KEY],
  providerOrUrl: "https://" + NETWORK + ".infura.io/v3/" + INFURA_KEY,
  addressIndex: 0,
});

// Initialize the seaport.
const seaport = new OpenSeaPort(
  provider,
  {
    networkName: NETWORK === "mainnet" ? Network.Main : Network.Goerli,
    apiKey: API_KEY,
  },
  (arg) => console.log(arg)
);

async function main() {
  const tokenId = args[0];

  // Make a bid on an item.
  console.log(
    `Bidding on https://testnets.opensea.io/assets/${TARGET_CONTRACT_ADDRESS}/${tokenId}`
  );
  try {
    const offer = await seaport.createBuyOrder({
      asset: {
        tokenId,
        tokenAddress: TARGET_CONTRACT_ADDRESS,
      },
      startAmount: args[1],
      accountAddress: MY_ADDRESS,
    });
    console.log("Successfully created a buy order!");
  } catch (e) {
    console.log("Failed:", e);
  }
}

main().then(() => process.exit());
