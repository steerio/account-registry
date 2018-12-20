const Foo = artifacts.require('./Foo.sol');

require('./helpers/assert');
const {alwaysCleanState} = require('./helpers/state');

contract('Accounts', (accounts) => {
  const [from, alice, bob, charlotte] = accounts;
  const ZERO = '0x0000000000000000000000000000000000000000';
  let ct;

  before(async () => {
    ct = await Foo.deployed();
  });

  it('should add elements', async () => {
    await assert.passes(ct.verify(alice, {from}));
    assert.deepEqual(await ct.enumerate(ZERO, 1), [alice]);
  });

  it('should remove elements', async () => {
    await assert.passes(ct.verify(alice, {from}));
    await assert.passes(ct.relegate(alice, {from}));
    assert.deepEqual(await ct.enumerate(ZERO, 1), [ZERO]);
  });

  it('should readd deleted element without screwing up head', async () => {
    await assert.passes(ct.verify(alice, {from}));
    await assert.passes(ct.verify(bob, {from}));
    await assert.passes(ct.verify(charlotte, {from}));
    await assert.passes(ct.relegate(bob, {from}));
    await assert.passes(ct.verify(bob, {from}));
    await assert.passes(ct.relegate(bob, {from}));
    assert.deepEqual(await ct.enumerate(ZERO, 3), [charlotte, alice, ZERO]);
  });
});
