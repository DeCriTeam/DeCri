## design_pattern_desicions.md

This document explains why we choose to use the design patterns that we did.

#### Fail early and fail loud
All functions check the condition required for execution as early as possible in the function body (using the require function and revert function in one case) and throws an exception if the condition is not met. This is a good practice to reduce unnecessary code execution in the event that an exception will be thrown.

#### Restricting access

We used the modifier ```OnlyOwner``` to withdraw ether from Acro.sol contract.


#### Economic Patterns
Tight Variable Packing:
Order in our structures are arranged in order to optimize gas consumption when storing or loading statically-sized variables.


Memory Array Building: 
In order to aggregate and retrieve data from contract storage in a gas efficient way, we systematically used the view attribute for our getters.
We also used several mappings to avoid using loop.