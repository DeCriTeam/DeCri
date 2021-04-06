// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

ERC1155: Stocker 1 seul jeu de caractéristiques mais avoir 100 exemplaires

contract Lagoon is ERC721 {

   struct RealZone {
      // Identifiant de la zone = Index dans le tableau 
      // Voir opensea
      // uint lagoon_id;
      // uint quantite = 100;

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

   constructor() ERC721("LAGOON", "LAG") {

   }      

  // TODO: Redéfinir les mécanismes de transfer pour le prélèvement de frais

  function merge_token() {
     // TODO: fusion de tokens
  } 
}
