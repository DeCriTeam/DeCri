## avoiding_common_attacks.md

This document explains which measures we took to ensure that our contracts are not susceptible to common attacks.

* #### Solidity version
All smartcontracts are written in 0.8.0 Solidity version
We locked pragma to a specific compiler version (a recent one, a proven version, not the lastest that is not proven)

* #### External calls
Attacks are avoided using the withdraw pattern. Tokens balance are kept within the contract in balances mapping.
Require statement are used to check conditions.
We use modifiers only for checks.
We used only the transfer function, send and call methods were avoided.

* #### Randomness
None of our contract is using random numbers.

* #### Arithmetic Precision
No division are performed, so no rounding errors should be expected.

* #### Cross-function Race Conditions
Internal function are used appropriately.

* #### Timestamp Dependence
The scale of our time-dependent event (acro staking) can vary by 15 seconds and maintain integrity, so it is safe to use a block.timestamp. We don't use block.number as a timestamp.

* #### Gas Limit and Loops
There is only one unknown size loop but since it's a view function that is only executed to read data from the blockchain, it does not cost any gas.

* #### Overpowered Owner
Only Acro.sol is coupled to its owner, making only one function callable only by the owner address, the function which allows to withdraw the ether from the contract.

* #### Tx.origin
None of our contracts rely on tx.origin for authentification, msg.sender is used instead.

* #### Other considerations
We used events to monitor our smart contracts activity.
We explicitly marked payable functions and state variables
We explicitly marked visibility in functions and state variables.







