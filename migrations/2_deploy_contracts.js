var Acro = artifacts.require("./Acro.sol");
var Lagoon = artifacts.require("./Lagoon.sol");
var AcroActors = artifacts.require("./AcroActors.sol");

module.exports = function(deployer) {
  deployer.deploy(Acro, 10000000000000000000000).then(function () { // to be changed/defined
    deployer.deploy(AcroActors).then( function () {
      return deployer.deploy(Lagoon, Acro.address, AcroActors.address)
    });
  });
};
