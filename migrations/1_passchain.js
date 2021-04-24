const PassToken = artifacts.require("PassToken");

module.exports = function (deployer) {
  deployer.deploy(PassToken);
};
