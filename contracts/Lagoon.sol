// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

<<<<<<< HEAD
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
=======
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// Change ERC721 to ERC1155: Stocker 1 seul jeu de caractéristiques mais avoir 100 exemplaires

contract Lagoon is ERC721 {
>>>>>>> 9999c1c1b05c244b542e21103f457260ad341c83

contract Lagoon is ERC1155 {
   struct RealZone {
      // Identifiant de la zone = Index dans le tableau 
<<<<<<< HEAD
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
=======
      // Voir opensea
      // uint lagoon_id;
      // uint quantite = 100;

      uint date_prise_photo; //change type?
      string jpeg_file; //link toward image
      uint latitude; //latitude of coral reef area
      uint longitude; //longitude of coral reef area
      uint depth; //in meters, classes? in that case it would be string
      
      uint nb_coral_species; //number of coral reef species
      uint nb_dead_corals; // in order to calculate a percentage of alive coral?
      uint heath_state;		// TO BE DEFINED 0-very bad health -> 5 top reef! Faire un enum. Une zone peut aussi avoir un état "n'existe plus"

      address actor;	// Acteur qui a référencé la zone (pour statistiques)
>>>>>>> 9999c1c1b05c244b542e21103f457260ad341c83
			// Pour connaitre l'individu qui a adpoté une part de la zone, il faut regarder l'affectation via son NFT "Lag"
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
