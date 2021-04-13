const Acro = artifacts.require("./Acro.sol");
const Lagoon = artifacts.require("./Lagoon.sol");
const AcroActors = artifacts.require("./AcroActors.sol");

module.exports = async function(deployer) {
  // Deploy Acro Contract
  await deployer.deploy(Acro)
  const acro_contract = await Acro.deployed()
  
  // Deploy AcroActors
  await deployer.deploy(AcroActors, acro_contract.address); //, Acro.address
  const acroActors = await AcroActors.deployed()

  // Deploy Lagoon
  await deployer.deploy(Lagoon, acro_contract.address, acroActors.address)
  const lagoon = await Lagoon.deployed()
};
