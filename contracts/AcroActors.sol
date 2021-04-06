// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcroActors {
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
}

