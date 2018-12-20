const saveState = async () =>
  web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_snapshot",
    id: 0
  });

const revertState = async (id) =>
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_revert",
    params: [id],
    id: 0
  });

const stack = [];

module.exports = {
  alwaysCleanState: function () {
    beforeEach(async () => stack.push((await saveState()).result));
    afterEach(async () => await revertState(stack.pop()));
  }
}
