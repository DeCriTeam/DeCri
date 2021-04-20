## design_pattern_desicions.md
Ce document doit expliquer les modèles de conception choisis et la raison du choix. Ce lien peut vous aider https://fravoll.github.io/solidity-patterns/. 

This document explains why we choose to use the design patterns that we did.

#### 0. Fail early and fail loud

All functions check the condition required for execution as early as possible in the function body (using the require function and revert function in one case) and throws an exception if the condition is not met. This is a good practice to reduce unnecessary code execution in the event that an exception will be thrown.

#### 1. restricting access

We used the modifier ```OnlyOwner``` to withdraw ether from Acro.sol contract.


______________
Behavioral Patterns
    Guard Check: Ensure that the behavior of a smart contract and its input parameters are as expected.

    State Machine: Enable a contract to go through different stages with different corresponding functionality exposed.

Security Patterns

    Access Restriction: Restrict the access to contract functionality according to suitable criteria.

    Checks Effects Interactions: Reduce the attack surface for malicious contracts trying to hijack control flow after an external call.

    Secure Ether Transfer: Secure transfer of ether from a contract to another address.

    Pull over Push: Shift the risk associated with transferring ether to the user.

    Emergency Stop: Add an option to disable critical contract functionality in case of an emergency.


Upgradeability Patterns

    Proxy Delegate: Introduce the possibility to upgrade smart contracts without breaking any dependencies.
    Eternal Storage: Keep contract storage after a smart contract upgrade.

Economic Patterns
    String Equality Comparison: Check for the equality of two provided strings in a way that minimizes average gas consumption for a large number of different inputs.

    Tight Variable Packing: Optimize gas consumption when storing or loading statically-sized variables.
    
    Memory Array Building: Aggregate and retrieve data from contract storage in a gas efficient way.

