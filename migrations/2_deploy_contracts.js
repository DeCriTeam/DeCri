var Acro = artifacts.require("./Acro.sol");
var Lagoon = artifacts.require("./Lagoon.sol");
var AcroActors = artifacts.require("./AcroActors.sol");

module.exports = function(deployer) {
  deployer.deploy(Acro).then(function () { // to be changed/defined
    deployer.deploy(AcroActors).then( function () {
      return deployer.deploy(Lagoon, Acro.address, AcroActors.address)
    });
  });
};
