pragma solidity ^0.4.23;
import "./Accounts.sol";

contract Foo {
  using Accounts for Accounts.Registry;
  Accounts.Registry internal accounts;

  function verify(address account) external {
    accounts.add(account);
  }

  function verifyAddresses(address[] _accs) external {
    for (uint i=0; i<_accs.length; i++) {
      accounts.add(_accs[i]);
    }
  }

  function relegate(address account) external {
    accounts.remove(account);
  }

  // This is impractical, we only need it for the tests.
  function enumerate(address _after, uint n) view external returns (address[]) {
    address curr = accounts.data[_after].next;

    uint i=0;
    address[] memory buf = new address[](n);
    while (i<n && curr != address(0)) {
      buf[i++] = curr;
      curr = accounts.data[curr].next;
    }
    return buf;
  }
}
