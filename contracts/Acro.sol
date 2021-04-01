// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Acro is ERC20 {
    constructor() ERC20("Acropora Token", "ACRO") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}

