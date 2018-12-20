const revert = 'VM Exception while processing transaction: revert';

const addMsg = (dflt, msg) => (msg ? `${msg} (${dflt})` : dflt);
const match = e => e.message.indexOf(revert) == 0;

const ext = {
  revertsWith: async (promise, expected, msg) => {
    try {
      await promise;
      assert(false, addMsg('Did not revert', msg));
    } catch (e) {
      let found = match(e);
      if (!found) throw(e);
      if (expected) {
        let reason = e.message.substr(revert.length+1);
        if (typeof(expected) == 'string') {
          assert.equal(reason, expected, addMsg(`Expected "${expected}", got "${reason}"`, msg));
        } else {
          found = reason.match(expected);
          assert(
            reason.match(expected),
            addMsg(`Expected "${reason}" to match ${expected}`, msg));
        }
      }
    }
  },
  reverts: async (promise, msg) => {
    return ext.revertsWith(promise, null, msg);
  },
  passes: async promise => {
    try {
      await promise;
    } catch (e) {
      const found = match(e);
      assert.isNull(found, "Call was expected not to be reverted");
      if (!found) throw(e);
    }
  },
  equal: function(a, b, msg) {
    if (a.s && !b.s) b = new a.constructor(b);
    if (b.s && !a.s) a = new b.constructor(a);
    if (a.s) {
      // If they are equal, return a fake check. It's fine.
      if (a.equals(b)) return this.__equal(a.toString(), a.toString(), msg);
      // If they are not, make the strings unequal, too.
      return this.__equal(`${a}(1)`, `${b}(2)`, msg);
    }
    return this.__equal(a, b, msg);
  }
};

if (!assert.__equal) {
  assert.__equal = assert.equal;
  for (var i in ext) assert[i] = ext[i];
}
