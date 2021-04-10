const Diplome = artifacts.require("Diplome");

module.exports = function (deployer) {
  deployer.deploy(Diplome);
};
