const Accounts = artifacts.require("./Accounts.sol");
      Foo      = artifacts.require("./Foo.sol");

module.exports = function(deployer) {
  deployer.deploy(Accounts);
  deployer.link(Accounts, Foo);
  deployer.deploy(Foo);
};
