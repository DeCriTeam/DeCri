// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcroDatabase {

   // TODO: Affiner et optimiser les types de données ci dessous
   // TODO: Arbitrer la manière dont on empile l'historique de l'état d'une zone
   struct ZoneRelle {
      // Identifiant de la zone = Index dans le tableau 
      uint date_prise_photo;
      string fichier;
      uint latitude;
      uint longitude;
      uint profondeur;
      uint taille;
      uint espece;
      uint nb_especes_coraux;
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

   mapping(address => bool) actors_whitelist;
   mapping(address => bool) actors_blacklist;

   // TODO:
   // Mécanisme de vote avec proposals sous forme de texte
   // Mécanisme de vote permettant l'acceptation d'un nouvel acteur

   function new_actor_request() public {

   }

   function approve_actor_request() public {
      require(actors_whitelist[msg.sender]==true);
      // Si le nb d'approve > seuil -> ajout à la whitelist + retrait blacklist
      // Offre de l'acro pour compenser les frais de gas
   }

   function blacklist_request() public {
      require(actors_whitelist[msg.sender]==true);
      // Si le nb de requests > seuil -> ajout à la blacklist
   }

   function new_zone(/* infos sur la zone */) public {	// Argument: voir si il est possible de passer une structure
      require(actors_whitelist[msg.sender]==true);
   }

   function update_zone_state(/* infos sur la zone */) public {
      require(actors_whitelist[msg.sender]==true);
   }
}

