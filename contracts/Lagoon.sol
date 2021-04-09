// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Lagoon is ERC1155 {
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

   struct VirtualItem {
      uint8 x;
      uint8 y;
      uint8 item_type;
   }

   struct VirtualZone {
      string zone_name;
      VirtualItem[] items;
   }

   RealZone real_zone;
   VirtualZone virtual_zone;
*/

   constructor() ERC1155("https://ipfs.io/xxxx") {   //("LAGOON", "LAG")
      
   }      

   function merge_token(uint token_id) external {
     // TODO
   } 

   function lock(uint token_id,uint amount) external {
      // TODO
   }

   function unlock(uint token_id, uint amount) private {
      // TODO
   }

   function buy_virtual_item(uint token_id,uint item_type_id) external payable {
      // TODO
   }

   function add_virtual_item(uint token_id, uint item_id, uint8 x, uint8 y) external {
      // TODO
   }
}
