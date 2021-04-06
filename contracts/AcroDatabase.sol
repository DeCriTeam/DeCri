// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcroDatabase is AcroActors {

   // TODO: Affiner et optimiser les types de données ci dessous
   // TODO: Arbitrer la manière dont on empile l'historique de l'état d'une zone
   struct ZoneRelle {
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

   struct ItemJeu {
      uint8 x;
      uint8 y;
      uint8 type_item;
   }

   struct ZoneVirtuelleJeu {
      ItemJeu[] items_jeu;
      // Pour connaitre l'individu qui possède cette zone virtuelle, il faut regarder l'affectation via son NFT "Lag"
   }    

   ZoneRelle[] zones_reelles;
   ZoneVirtuelleJeu[] zones_virtuelles_jeu;

   function new_zone(/* infos sur la zone */) public {	// Argument: voir si il est possible de passer une structure
      require(actors_whitelist[msg.sender]==true);
   }

   function update_zone_state(/* infos sur la zone */) public {
      require(actors_whitelist[msg.sender]==true);
   }
}

