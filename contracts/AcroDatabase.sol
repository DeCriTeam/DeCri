// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcroDatabase {

   // TODO: Affiner et optimiser les types de données ci dessous
   // TODO: Arbitrer la manière dont on empile l'historique de l'état d'une zone
   struct Zone {
      // TODO: Identifiant de la zone ? Index dans le tableau ?
      uint date_prise_photo;
      string fichier;
      uint latitude;
      uint longitude;
      uint profondeur;
      uint taille;
      uint espece;
      uint nb_especes_coraux;
      uint etat;

      address acteur;
   }

   // Les données associées au jeu sont mémorisées dans le NFT
   // Pour connaitre la liste des terrains d'un joueur, il suffit de consulter les NFT dans son wallet
   // Définition d'un joueur, c'est quelqu'un qui possède au moins un NFT dans son wallet

   Zone[] zones;
   mapping(address => bool) acteurs;

   // TODO:
   // Mécanisme de vote avec proposals sous forme de texte
   // Mécanisme de vote permettant l'acceptation d'un nouvel acteur
   // Révocation d'un acteur existant ? table de blacklist ?
}

