// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2; // A voir si on l'utilise (pour récupérer tableau dans front)

contract AcroActors {
   // A voir: un seul tableau: Quand on blacklist on supprime l'entrée (ou mise à false)
   // mapping(address => bool) actors_whitelist;
   // mapping(address => bool) actors_blacklist;

   struct Actor {
      bool isRegistered;
      uint nbMintedArea; // to be put in a mapping instead?
      string dateOfRegistration; // ? do we put that - CHECK variable type
   
      string actorName;
      string country;
      uint latCenter;
      uint longCenter;
      string email; //type to be checked
      uint yearOfCreation; // year of birth of NGO ?
      
   }

   mapping(address => Actor) public RegisteredActors;
   address[] public actors;

   //List of events
   event ActorRegistered(address actorAddress);
   event ActorDeleted(address actorAddress);


   //NOT FINISHED: adding new actors
   function add_new_actor(address _address,
                          string _actorName,
                          uint _latCenter;
                          uint _longCenter;
                          string _email; //type to be checked
                          uint _yearOfCreation;
                          ) public {
      require(!RegisteredActors[_address].isRegistered != true,"This address is already registered";
      RegisteredActors[_address] = Actor(true,0,date, _actorName, _latCenter, _longCenter, _email; _yearOfCreation); //DATE A VOIR
      actors.push(_address);
      emit ActorRegistered(_address);

   }

   //TO DO: to get actor table: 
   function get_actors() public {

   }



   // TODO:
   // Mécanisme de vote avec proposals sous forme de texte
   // Mécanisme de vote permettant l'acceptation d'un nouvel acteur


   //TO DO
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

