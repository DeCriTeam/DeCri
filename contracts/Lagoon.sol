// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Acro.sol";
import "./AcroActors.sol";

contract Lagoon is ERC1155 {
   struct GameItem {
      uint8 x;
      uint8 y;
      uint8 item_type;
   }

   Acro acro_contract;
   AcroActors actors_contract;

   using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;

   mapping (uint256 => string) private _tokenURIs;
   mapping (uint256 => GameItem[]) public game_items;

   constructor(address acro_contract_address, address actors_contract_address) ERC1155("") {
     acro_contract = Acro(acro_contract_address);
     actors_contract = AcroActors(actors_contract_address);
   } 

   function uri(uint256 token_id) public view virtual override returns (string memory) {
      return _tokenURIs[token_id];
   }

   function new_real_zone(string memory metadatas_url) external {
      // TODO: only actors
      _tokenIds.increment();
      _mint(msg.sender, _tokenIds.current(), 100, "");
      _tokenURIs[_tokenIds.current()] = metadatas_url;
   }

   function get_tokens_count() external view returns (uint) {
      return _tokenIds.current();
   }

   function merge_token(uint token1_id, uint token2_id) external {
     // TODO Vérifier token1: pur virtuel ; token2: pur reel
     // TODO
   } 

   function buy_and_put_game_item(uint token_id, uint8 x, uint8 y,uint8 item_type) external {
     // Vérifier que ce token_id m'appartient bien
     // TODO: faire payer en erc20
     // Vérifier que l'emplacement est libre
     acro_contract.transferFrom(msg.sender, address(acro_contract),100000000000000000);
     game_items[token_id].push(GameItem(x,y,item_type));
   }

   function get_game_level(uint token_id) external view returns (uint) {
      return game_items[token_id].length;
   }
}
