// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Lagoon is ERC1155 {
   struct GameItem {
      uint8 x;		// 0 = non placé ?
      uint8 y;		// 0 = non placé ?
      uint8 item_type;
   }

   using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;

   mapping (uint256 => string) private _tokenURIs;
   mapping (uint256 => GameItem[]) public game_items;

   // TODO: Trouver une solution pour l'argument url
   constructor() ERC1155("") {
      
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

   function buy_game_item(uint item_type) external {
      // TODO
   }

   function put_item(uint item_type, uint8 x, uint8 y) external {
     // TODO: verifier si on possède assez de cet item_type
   }

   function get_game_level() external returns (uint8) {
      // TODO
      return 0;
   }

/*
   struct RealZone {
      uint photo_date;	// Change data type ?
      string jpeg_file; //link toward image
      uint latitude; //latitude of coral reef area
      uint longitude; //longitude of coral reef area
      uint depth; //in meters, classes? in that case it would be string
      
      uint nb_coral_species; //number of coral reef species
      uint nb_dead_corals; // in order to calculate a percentage of alive coral?
      uint heath_state;		// TO BE DEFINED 0-very bad health -> 5 top reef! Faire un enum. Une zone peut aussi avoir un état "n'existe plus"

      address actor;	//  For statistics
   }

   }

   struct VirtualZone {
      string zone_name;
      VirtualItem[] items;
   }

   RealZone real_zone;
   VirtualZone virtual_zone;
*/


}
