//Acro.sol token Acropora
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Acro is ERC20 {
    constructor(uint256 initialSupply) ERC20("Acropora Token", "ACRO") {
        _mint(msg.sender, initialSupply);
    }
    
    function tmp_buy_accro(uint amount) external payable {
       require(msg.value == amount*2);
       _mint(msg.sender, amount);		// A voir: se servir dans le initial supply
    }
}

