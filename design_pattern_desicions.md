## design_pattern_desicions.md
Ce document doit expliquer les modèles de conception choisis et la raison du choix. Ce lien peut vous aider https://fravoll.github.io/solidity-patterns/. 

This document explains why we choose to use the design patterns that we did.

#### 0. Fail early and fail loud

All functions check the condition required for execution as early as possible in the function body and throws an exception if the condition is not met. This is a good practice to reduce unnecessary code execution in the event that an exception will be thrown.

#### 1. restricting access

Use modifier ```OnlyOwner``` to withdraw ether from Acro.sol contract.

