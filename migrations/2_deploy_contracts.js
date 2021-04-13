var Acro = artifacts.require("./Acro.sol");
var Lagoon = artifacts.require("./Lagoon.sol");
var AcroActors = artifacts.require("./AcroActors.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Acro);
  await deployer.deploy(AcroActors, Acro.address);
  await deployer.deploy(Lagoon, Acro.address, AcroActors.address)
};
