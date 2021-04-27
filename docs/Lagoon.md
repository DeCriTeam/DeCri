## `Lagoon`





### `onlyActor()`





### `tokenExists(uint256 token_id)`





### `isMyToken(uint256 token_id)`






### `constructor(address acro_contract_address, address actors_contract_address)` (public)

Acro and Actors contract's addresses are set on this contract during deployment




### `uri(uint256 token_id) → string` (public)

get json metadata file urls




### `new_real_zone(string metadatas_url)` (external)

Declare a new physical coral zone in the database
this declaration is allowed for verified actors only




### `update_real_zone(uint256 token_id, string metadatas_url)` (external)

Declare a new state for an existing physical coral zone in the database
This declaration is allowed for verified actors only
Every actor is allowed to update informations about any coral aone




### `new_virtual_zone() → uint256` (external)

Create a new game party (virtual zone)
Everybody can create a new virtual zone




### `merge_tokens(uint256 real_token_id, uint256 virtual_token_id)` (external)

Any user can merge one of his real token with one of his virtual zone
Virtual token is linked to real token and change type to "BOTH" token
The real token is destroyed for this user
But this real token is kept in the database




### `get_tokens_count() → uint256` (external)

Get total tokens count (for UI)




### `buy_and_put_game_item(uint256 token_id, struct Lagoon.GameItem item)` (external)

Buy and add item for our game and put it on a virtual zone




### `get_game_level(uint256 token_id) → uint256` (public)

Level increase for a virtual zone when a user adds items on it
this function gets the level for a given virtual zone




### `get_game_datas(uint256 token_id) → string` (external)

gets serialized datas for a given virtual zone (item mapping)





