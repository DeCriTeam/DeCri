//Acro.sol token Acropora
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Acro is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Acropora Token", "ACRO") {
      // _mint(/* msg.sender */ address(this), 10000000000000000000000 /* initialSupply*/ );
      _mint(msg.sender, initialSupply); //for tests, otherwise it does not work
    }
    
   //List of events
   event buyingAcro(address msgsender, uint256 amount);
   event donatingAcro(address msgsender, uint256 amout);
   event withdrawal(address otheradress, uint256 amount);

   // TO DO - modify fonction, to be discussed
    function tmp_buy_acro() external payable {
       require(msg.value>0);
       // _mint(msg.sender, msg.value*20);
       _transfer(address(this), msg.sender, msg.value*20);		// TODO: Handle Error
       emit buyingAcro(msg.sender, msg.value);
    }

    function get_ether_balance_of_this_contract() external view returns (uint) {
       return address(this).balance;
    }

    function get_acro_balance_of_this_contract() external view returns (uint) {
       return balanceOf(address(this));
    }

   // Does not work on Ganache: wrong user eth balance value. seems to be a Ganache bug
    function get_ether_balance_of_sender() external view returns (uint) {
       return msg.sender.balance;
    }

    function get_acro_balance_of_sender() external view returns (uint) {
       return balanceOf(msg.sender);
    }

    function acro_donation(uint256 amount) external {
       require(amount > 0, "amount cannot be 0");
       transfer(address(this), amount);
       emit donatingAcro(msg.sender, amount);
    }

   //to be checked and modified?
    function withdraw_ether(uint256 amount) external payable onlyOwner {
      require(address(this).balance >= amount, "account balance is too low");
      payable(msg.sender).transfer(amount);
      emit withdrawal(msg.sender, amount);
    }

   //-------------------------------------------------------------------------
   //Staking Acro: Actors must stake a certain amount of Acro to be able to ...
   //-------------------------------------------------------------------------

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

   // User put Acro into the Acro (making then a deposit)
    function stakeAcroTokens(uint _amount) public {
         // Amount must be greater than zero
         require(_amount > 0, "amount cannot be 0");
         //transfer token to this contract for staking
         transfer(address(this), _amount);
         //acrotokenaddress.transferFrom(msg.sender, address(this), _amount); //if we split the contract
         //update staking balance
         stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
         // Add user to stakers array *only* if they haven't staked already
         if(!hasStaked[msg.sender]) {
               stakers.push(msg.sender);
         }
         // Update staking status
         isStaking[msg.sender] = true;
         hasStaked[msg.sender] = true;
            
       }

    // Unstaking Tokens (Withdraw) - user can only widthdraw all tokens
    // Later: a timelook should be implemented, i.e. stakers must stake for at least a certain period of time
    function unstakeTokens() public {
        // Fetch staking balance
        uint256 balance = stakingBalance[msg.sender];
        // require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");
        //transfer token to staker
        //acrotokenaddress.transfer(msg.sender, balance); //if we split the contract
      //   transfer(msg.sender, balance); //ISSUE HERE ?? transferFrom instead?
        _transfer( address(this), msg.sender, balance);
        //reset staking balance
        stakingBalance[msg.sender] = 0;
        //update tokens staked status
        isStaking[msg.sender] = false;
    }

}

