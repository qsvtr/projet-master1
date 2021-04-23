const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config({path: '../.env'})

const mnemonic = process.env.mnemonic
const nodeAPI = process.env.nodeAPI

module.exports = {
  networks: {
   development: {
     provider: function() {
      return new HDWalletProvider(mnemonic, `${nodeAPI}/ext/bc/C/rpc`)
     },
     network_id: "*",
     gas: 3000000,
     gasPrice: 225000000000
   }
  },
    compilers: {
      solc: {
          version: "^0.8.0"
      }
    }
};
