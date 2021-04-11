var Acro = artifacts.require("./Acro.sol");
var Lagoon = artifacts.require("./Lagoon.sol");
var AcroActors = artifacts.require("./AcroActors.sol");

module.exports = function(deployer) {
  deployer.deploy(Acro, 100000000); // to be changed/defined
  deployer.deploy(Lagoon);
  deployer.deploy(AcroActors);
};
