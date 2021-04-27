## `Acro`






### `constructor()` (public)



Initial supply is produced at deployment
ERC20 Standard, token is named Acro

### `buy_acro()` (external)



to buy acro

### `get_ether_balance_of_this_contract() → uint256` (external)



to get the balance in ether of this contract


### `get_acro_balance_of_this_contract() → uint256` (external)



to get the balance in acro of this contract


### `get_ether_balance_of_sender() → uint256` (external)



to get the balance in ether of the message sender


### `get_acro_balance_of_sender() → uint256` (external)



to get the balance in acro of the message sender


### `acro_donation(uint256 amount)` (external)



to make a donation in acro to this contract
acro'balance must be greater than 0


### `withdraw_ether(uint256 amount)` (external)

ether'balance must be greater than the requested amount



### `is_staking_acro(address addr) → bool` (external)



get if an actor is staking acro or not (for IU)


### `staking_balance(address addr) → uint256` (external)



get the staking balance of an actor (for IU)


### `stakeAcroTokens(uint256 _amount)` (public)



to stake acro in the contract in order to vote (used in AcroActors.sol)
staked amount must be greater than zero
staking balance is updated
sdd user to stakers array *only* if they haven't staked already
staking staking status are updated


### `unstakeTokens()` (public)



to unstake all the user'acro from the contract
staking balance of user must be greater than zero
staking balance is updated
staking staking status are updated


### `buyingAcro(address msgsender, uint256 amount)`





### `donatingAcro(address msgsender, uint256 amount)`





### `withdrawal(address msgsender, uint256 amount)`





