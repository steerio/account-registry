pragma solidity ^0.4.23;

library Accounts {
  struct Registry {
    mapping(address => Account) data;
  }
  struct Account {
    bool active;
    address prev;
    address next;
  }

  address public constant NULL = address(0);

  function add(Registry storage self, address account) internal {
    Account storage acc = self.data[account];
    if (acc.active) return;
    Account storage root = self.data[NULL];
    address head = root.next;
    acc.active = true;
    self.data[head].prev = account;
    acc.next = head;
    root.next = account;
  }

  function remove(Registry storage self, address account) internal {
    Account storage acc = self.data[account];
    if (!acc.active) return;
    acc.active = false;
    self.data[acc.prev].next = acc.next;
    if (acc.next != NULL) self.data[acc.next].prev = acc.prev;
    acc.prev = NULL;
  }
}
