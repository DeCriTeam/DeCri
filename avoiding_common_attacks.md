## avoiding_common_attacks.md

This document explains which measures we took to ensure that our contracts are not susceptible to common attacks.

* #### Re-entrancy

    TO BE COMPLETED
    send()/ call.value()
    Attacks are avoided using the withdraw pattern. Tokens balance are kept within the contract in balances mapping. 

    TO BE CHECKED
    Handling the multi-contract situtations: a called contract could modify the state of another contract you depend on

    
    We use modifiers only for checks.

* #### Fallback functions
Keep fallback functions simple
Check data length in fallback functions


* #### Randomness
None of our contract is using random numbers.

* #### Arithmetic Precision
No division are performed, so no rounding errors should be expected.


* #### Cross-function Race Conditions

    Internal function are used appropriately.


* #### Forcibly Sending Ether to a Contract
    
    TO BE CHECKED : JULIEN
    this smart project can receive any amount in ether at any time.


* #### Transaction-Ordering Dependence (TOD) ?

    program logic does not affected by transactions order

* #### Timestamp Dependence

    The scale of our time-dependent event (acro staking) can vary by 15 seconds and maintain integrity, so it is safe to use a block.timestamp. We don't use block.number as a timestamp.

* #### Gas Limit and Loops

    There is only one unknown size loop but since it's a view function that is only executed to read data from the blockchain, it does not cost any gas.
    TO BE CHECKED: "still such functions may be called by other contracts as part of on-chain operations and stall those".

* #### Overpowered Owner

Only Acro.sol is coupled to its owner, making only one function callable only by the owner address, the function which allows to withdraw the ether from the contract.

TO BE ADDED: multisig ?

* #### Tx.origin
    None of our contracts rely on tx.origin for authentification, msg.sender is used instead.

* #### Call Stack Depth
    TO BE CHECKED

* #### Other considerations TO BE CHECKED
Explicitly mark payable functions and state variables
Explicitly mark visibility in functions and state variables
Lock pragmas to specific compiler version
Use events to monitor contract activity





_____________
SEE THE RECOMMENDATIONS: e.g. Restrict the amount of Ether (or other tokens) that can be stored in a smart contract. If your source code, the compiler or the platform has a bug, these funds may be lost. If you want to limit your loss, limit the amount of Ether.





