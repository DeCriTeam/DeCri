//Acro.sol token Acropora
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Acro is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Acropora Token", "ACRO") {
        _mint(/* msg.sender */ address(this), 10000000000000000000000 /* initialSupply*/ );
    }
    
   //List of events
   event buyingAcro(address msgsender, uint256 amount);
   event donatingAcro(address msgsender, uint256 amout);
   event withdrawal(address otheradress, uint256 amount);

    function tmp_buy_acro() external payable {
       require(msg.value>0);
       // _mint(msg.sender, msg.value*20);
       _transfer( address(this), msg.sender, msg.value*20);		// TODO: Handle Error
       emit buyingAcro(msg.sender, msg.value);
    }

    function get_ether_balance_of_this_contract() external view returns (uint) {
       return address(this).balance;
    }

    function get_acro_balance_of_this_contract() external view returns (uint) {
       return balanceOf(address(this));
    }

   // Does not work on Ganache: wrong user eth balance value. Ganache bug or what ?
    function get_ether_balance_of_sender() external view returns (uint) {
       return msg.sender.balance;
    }

    function get_acro_balance_of_sender() external view returns (uint) {
       return balanceOf(msg.sender);
    }

    function acro_donation(uint256 amount) external {
       transfer(address(this), amount);
       emit donatingAcro(msg.sender, amount);
    }

    function withdraw_ether(uint256 amount) external payable onlyOwner {
      require(address(this).balance >= amount, "account balance is too low");
      payable(msg.sender).transfer(amount);
      emit withdrawal(msg.sender, amount);
    }

}

