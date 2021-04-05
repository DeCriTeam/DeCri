const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ropsten2: {
      provider: function() { return new HDWalletProvider(`${process.env.MNEMONIC}`, `${process.env.INFURA_URL}`) },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
