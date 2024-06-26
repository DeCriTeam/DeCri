const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten2: {
      provider: function() { return new HDWalletProvider(`${process.env.MNEMONIC}`, `${process.env.INFURA_URL}`) },
      network_id: 3
    },
    rinkeby: {
      // provider: function() {
        // return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`)
      // },
      provider: function() { return new HDWalletProvider(`${process.env.MNEMONIC}`, `${process.env.INFURA_URL}`) },
      network_id: 4
    },
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
