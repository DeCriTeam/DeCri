//Acro.sol token Acropora
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Acro is ERC20 {
    constructor(uint256 initialSupply) ERC20("Acropora Token", "ACRO") {
        _mint(/* msg.sender */ address(this), 10000000000000000000000 /* initialSupply*/ );
    }
    
    function tmp_buy_acro() external payable {
       require(msg.value>0);
       // _mint(msg.sender, msg.value*20);
       _transfer( address(this), msg.sender, msg.value*20);		// TODO: Handle Error
    }

    function get_ether_balance_of_this_contract() external view returns (uint) {
       return address(this).balance;
    }

    function get_acro_balance_of_this_contract() external view returns (uint) {
       return balanceOf(address(this));
    }

    function get_ether_balance_of_sender() external view returns (uint) {
       return msg.sender.balance;
    }

    function get_acro_balance_of_sender() external view returns (uint) {
       return balanceOf(msg.sender);
    }

    function acro_donation(uint amount) external {
       transfer(address(this), amount); 
    }

    function withdraw_ether() /* onlyOwner */ external {
       // TODO
    }
}

