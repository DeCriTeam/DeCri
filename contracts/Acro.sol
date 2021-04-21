//Acro.sol token Acropora
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/** @title Token acro - production and storage */
contract Acro is ERC20, Ownable {

   /// @dev Initial supply is produced at deployment
   /// ERC20 Standard, token is named Acro
    constructor() ERC20("Acropora Token", "ACRO") {
      _mint(address(this), 10000000000000000000000);
    }
    
   //List of events
   event buyingAcro(address msgsender, uint256 amount);
   event donatingAcro(address msgsender, uint256 amout);
   event withdrawal(address otheradress, uint256 amount);

   // TO DO - modify fonction, to be discussed
   /// @dev to buy acro
    function buy_acro() external payable {
       require(msg.value>0, "You must enter an amount >0");
       _transfer(address(this), msg.sender, msg.value*20);
       emit buyingAcro(msg.sender, msg.value);
    }

   /// @dev to get the balance in ether of this contract
   /// @return uint balance in ether
    function get_ether_balance_of_this_contract() external view returns (uint) {
       return address(this).balance;
    }

   /// @dev to get the balance in acro of this contract
   /// @return uint balance in acro
    function get_acro_balance_of_this_contract() external view returns (uint) {
       return balanceOf(address(this));
    }

   // Does not work on Ganache: wrong user eth balance value. seems to be a Ganache bug!
   /// @dev to get the balance in ether of the message sender
   /// @return uint balance in ether
    function get_ether_balance_of_sender() external view returns (uint) {
       return msg.sender.balance;
    }
   /// @dev to get the balance in acro of the message sender
   /// @return uint balance in acro
    function get_acro_balance_of_sender() external view returns (uint) {
       return balanceOf(msg.sender);
    }

   /// @dev to make a donation in acro to this contract
   /// acro'balance must be greater than 0
   /// @param amount amount in acro to be donated 
    function acro_donation(uint256 amount) external {
       require(amount > 0, "amount cannot be 0");
       transfer(address(this), amount);
       emit donatingAcro(msg.sender, amount);
    }

   //// @dev to withdraw ether from this contract - so they are not stucked for ever!
   /// ether'balance must be greater than the requested amount
   
    function withdraw_ether(uint256 amount) external onlyOwner {
      require(address(this).balance >= amount, "account balance is too low");
      payable(msg.sender).transfer(amount);
      emit withdrawal(msg.sender, amount);
    }

   //---------------------------------------------------------------------------------------------
   //Staking Acro: Actors must stake a certain amount of Acro to be able to vote for other actors
   //--------------------------------------------------------------------------------------------

   //Julien: should we use a struc instead of all these mappings?
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint) public unlockDate;
    mapping(address => uint) public createdAt;

   
   /// @dev get if an actor is staking acro or not (for IU)
   /// @param addr actor'address
   /// @return true or false
    function is_staking_acro(address addr) external view returns (bool) {
      return isStaking[addr];
   }

   /// @dev get the staking balance of an actor (for IU)
   /// @param addr actor'address
   /// @return uint amount in acro
   function staking_balance(address addr) external view returns (uint) {
      return stakingBalance[addr];
   }
   

   /// @dev to stake acro in the contract in order to vote (used in AcroActors.sol)
   /// staked amount must be greater than zero
   /// staking balance is updated
   /// sdd user to stakers array *only* if they haven't staked already
   /// staking staking status are updated
   /// @param _amount nb of acros to be staked
   function stakeAcroTokens(uint _amount) public {
         require(_amount > 0, "amount cannot be 0");
         transfer(address(this), _amount);
         stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
         
         if(!hasStaked[msg.sender]) {
               stakers.push(msg.sender);
         }
         
         isStaking[msg.sender] = true;
         hasStaked[msg.sender] = true;
         createdAt[msg.sender] = block.timestamp;
            
       }

   /// @dev to unstake all the user'acro from the contract
   /// staking balance of user must be greater than zero
   /// staking balance is updated
   /// staking staking status are updated
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        unlockDate[msg.sender] =  createdAt[msg.sender] + 15 days; // TO BE DECIDED [+ 15 days; here set another value for testing purposes]
        require(balance > 0, "staking balance cannot be 0");
        require(block.timestamp >= unlockDate[msg.sender], "you must be staking for at least 15 days");
        _transfer( address(this), msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

}

