// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Lagoon is ERC1155 {
   struct RealZone {
      // Identifiant de la zone = Index dans le tableau 
      uint date_prise_photo;
      string fichier;
      uint latitude;
      uint longitude;
      uint profondeur;
      uint pourcentage_vivant;
      uint taille;
      uint espece;
      uint coral_species;
      uint state;		// Faire un enum. Une zone peut aussi avoir un état "n'existe plus"

      address acteur;	// Acteur qui a référencé la zone (pour statistiques)
			// Pour connaitre l'individu qui a adpoté une part de la zone, il faut regarder l'affectation via son NFT "Lag"
   }

   struct VirtualItem {
      uint8 x;
      uint8 y;
      uint8 item_type;
   }

   struct VirtuaZone {
      string zone_name;
      VirtualItem[] items;
   }

   RealZone real_zone;
   VirtuaZone virtual_zone;


   constructor() ERC1155("https://ipfs.io/")   //("LAGOON", "LAG") {
      
   }      

   function merge_token() {
     // TODO: fusion de tokens
   } 

   function lock(uint token_id,uint amount) {
      // TODO
   }

   function unlock(uint token_id, uint amount) private {
      // TODO
   }

   function buy_virtual_item(uint token_id,uint item_type_id) payable {
      // TODO
   }

   function add_virtual_item(uint token_id, uint item_id, uint8 x, uint8 y) {
      // TODO
   }
}
