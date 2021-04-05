var Acro = artifacts.require("./Acro.sol");
var Lagoon = artifacts.require("./Lagoon.sol");
var AcroDatabase = artifacts.require("./AcroDatabase.sol");

module.exports = function(deployer) {
  deployer.deploy(Acro);
  deployer.deploy(Lagoon);
  deployer.deploy(AcroDatabase);
};
