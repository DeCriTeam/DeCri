## avoiding_common_attacks.md

This document explains which measures we took to ensure that our contracts are not susceptible to common attacks.

* #### Reentrancy

    send()/ call.value()
    Attacks are avoided using the withdraw pattern. Tokens balance are kept within the contract in balances mapping. 

* #### Cross-function Race Conditions

    use internal function appropriately


* #### Forcibly Sending Ether to a Contract

    this smart project can receive any amount in ether at any time

* #### Transaction-Ordering Dependence (TOD) ?

    program logic does not affected by transactions order

* #### Timestamp Dependence

    The scale of our time-dependent event (acro staking) can vary by 15 seconds and maintain integrity, so it is safe to use a block.timestamp. We don't use block.number as a timestamp.

* #### DoS with (Unexpected) revert ?

    no refund situation, so no DoS with unexpected revert

* #### DoS with Block Gas Limit ?

    no unknown size loop
