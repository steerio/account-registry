pragma solidity ^0.4.23;
import "./Accounts.sol";

contract Static {
  struct Account {
    bool active;
    address prev;
    address next;
  }
  mapping(address => Account) accounts;

  address public constant NULL = address(0);

  function add(address account) internal {
    Account storage acc = accounts[account];
    if (acc.active) return;
    Account storage root = accounts[NULL];
    address head = root.next;
    acc.active = true;
    accounts[head].prev = account;
    acc.next = head;
    root.next = account;
  }

  function remove(address account) internal {
    Account storage acc = accounts[account];
    if (!acc.active) return;
    acc.active = false;
    accounts[acc.prev].next = acc.next;
    if (acc.next != NULL) accounts[acc.next].prev = acc.prev;
    acc.prev = NULL;
  }

  // This is impractical, we only need it for the tests.
  function enumerate(address _after, uint n) view external returns (address[]) {
    address curr = accounts[_after].next;

    uint i=0;
    address[] memory buf = new address[](n);
    while (i<n && curr != address(0)) {
      buf[i++] = curr;
      curr = accounts[curr].next;
    }
    return buf;
  }
}
