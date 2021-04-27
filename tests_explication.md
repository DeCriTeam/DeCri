## tests_explication.md 

> This document explains for each test what was tested and how.


## Test Struture

We chose to use exclusively **javascript tests**.
They are **located** under the **`test`** folder.  
  
We check the following for each key function of a smart-contract:
- **pre-requisites** (ie. `require`)
- **happy path**
- **failure cases** (like exceptions for instance).

To run these tests, you need to install:
- npm i @openzeppelin/test-helpers
- npm i ganache-time-traveler (note: does work only locally)


## `test/tokenAcro.test.js`
- initial status after deployment is correct, i.e. that the owner is the one that deployed the contract, the deployed ERC-20 token has the right name, the right symbol and initial supply.
- the deployed token (Acro) can be bought using ether: we checked the balance in ether and acro of the contract and one user respectively, before and after the transfer respectively.
- the deployed token bought by a user can be donated to the contract: we checked that the balances in acro of the contract and user before and after the donation.
- a user can buy and stake (lock) an amount in acro in the contract: we checked the balances in acro of the user and the contract before and after the staking, respectively.
- a user can unstake its acro token after 15 days. Here we use a function to simulate time-travelling. The function unstake reverts if less than 15 days has not passed since the staking date. Balances of both the contract and the "staker" in acros are checked before and after the unstaking process.
- the owner can withdraw the ether in the smart contract: the owner balance in ether before and after acro are bought is checked.

## `test/actors.test.js`
What we tested and how:
- the owner of this smart contract is a validated actor
- a user can register himself as an actor, as well as other actors: we checked the expected count of registered actors after registration
- a user cannot register an actor already registered (with the same address): the function add_new_actor reverts when a user tries to register an already registered address.
- a voting coefficient is calculated, i.e. the amount of locked (staked) acros must be greater or equal to 10 in order to get a voting coefficient of 1. We checked the coefficient using the expect function.
- a non-validated actor cannot vote: the voting function is expected to revert.
- a validated actor can vote for another registered actor, we checked that the expected event is emitted and that the registered number of votes matched the expected one.



## `test/lagoon.test.js`

- we checked if the owner is a validated actor
- we checked if non registered users are not validated
- we checked if only actors can create new real zone; the function that creates a new zone is reverted when a non-verified actor calls it.
- we checked that real zone are created properly, i.e. after creating two new zones, we checked the count of created real zones and that one of the created uri is equal to the expected one.
- only actors can add a state to new real zone: the function to create a new real zone reverts when a non-verified actor calls it
- real zones are properly updated: we checked the created uri is equal to the expected one.
- any user can create a virtual zone
- it is not possible to add a state to a virtual zone: the function called to update a real zone reverts. 
- users can buy and add items to a virtual zone:the function that allows buying and adding game item reverts when wrong id token is used
- anybody can merge a virtual and a real zone: merging function is checked and lagoon type is correct after merging.
- It is not possible to add a state to a virtual zone: function to update a real zone reverts when used to update a virtual zone.






