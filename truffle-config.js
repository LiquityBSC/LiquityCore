require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKeyBSC = process.env.PRIVATE_KEY_BSC;
var BSCProvider = new HDWalletProvider(privateKeyBSC, process.env.RPC_URL_BSC);

const privateKeyBSCTest = process.env.PRIVATE_KEY_BSC_TEST;
var BSCTestProvider = new HDWalletProvider(privateKeyBSCTest, process.env.RPC_URL_BSC_TEST);


module.exports = {

  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
     gasPrice: '5000000000',
     skipDryRun: true
    },
    BSC: {
      provider: BSCProvider,
      network_id: 56,
      gasPrice: '5000000000',
      timeoutBlocks: 200,
      skipDryRun: true
    },
    BSCTest: {
      provider: BSCTestProvider,
      network_id: 97,
      gasPrice: '10000000000',
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.11",
      settings: {
       optimizer: {
         enabled: true,
         runs: 1000
       },
      }
    }
  },

  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },

  db: {
    enabled: false
  }
};
