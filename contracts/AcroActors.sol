// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
// pragma experimental ABIEncoderV2; // A voir si on l'utilise (pour récupérer tableau dans front)

contract AcroActors {
   // A voir: un seul tableau: Quand on blacklist on supprime l'entrée (ou mise à false)
   // mapping(address => bool) actors_whitelist;
   // mapping(address => bool) actors_blacklist;

/*
   struct Actor {
      uint id; //!!to be added below & !!to be regrouped by var.cat. for optim
      bool isRegistered;
      bool isValidated;
      uint nbMintedArea; // to be put in a mapping instead?
      uint voteCount; //number of votes for this actor
      string dateOfRegistration; // ? do we put that - CHECK variable type
      
      string actorName;
      string country;
      uint latCenter;
      uint longCenter;
      uint yearOfCreation; // year of birth of NGO ?
      string email; //type to be checked
      string actorType; // individual, NGO, diving club
      
   }

   mapping(address => Actor) public RegisteredActors;
   address[] public actors;

   uint public actorCount; //to keep track of the number of actors and to generate a unique ID

   //List of events
   event ActorRegistered(address actorAddress);
   event ActorDeleted(address actorAddress);
   event votedEvent(uint indexed actor_id); //several actors at once?


   //NOT FINISHED: adding new actors
   function add_new_actor(address _address,
                          string memory _actorName,
                          string memory _country,
                          uint _latCenter,
                          uint _longCenter,
                          uint _yearOfCreation,
                          string memory _email, //type to be checked
                          string memory _actorType
                          
                          ) public {
      require(!RegisteredActors[_address].isRegistered != true,"This address is already registered");
      RegisteredActors[actorCount] = Actor(actorCount,true,false,0,0,date, _actorName, _country,_latCenter, _longCenter,  _yearOfCreation,_email,_actorType); //DATE A VOIR
      actors.push(_address);
      actorCount++;
      emit ActorRegistered(_address);
   }

   //To get actors informations: 
   function get_actors() external view returns (string[] memory,
                                                string[] memory,
                                                string[] memory,
                                                string[] memory,
                                                uint[] memory,
                                                uint[] memory,
                                                uint[] memory,
                                                uint[] memory,
                                                uint[] memory,
                                                bool[] memory
                                                ){
      string[] memory actorNames = new string[](actorCount);
      string[] memory countries = new string[](actorCount);
      string[] memory emails = new string[](actorCount);
      string[] memory actorTypes = new string[](actorCount);

      uint[] memory voteCounts = new uint[](actorCount);
      uint[] memory latCenters = new uint[](latCenter);
      uint[] memory longCenters = new uint[](longCenter);
      uint[] memory yearsOfCreation = new uint[](yearOfCreation);
      uint[] memory nbMintedAreas = new uint[](nbMintedArea);
      bool[] memory isValidateds = new uint[](isValidated);


      for(uint i = 0; i < actorCount; i++) {
         actorNames[i] = RegisteredActors[i].actorName;
         countries[i] = RegisteredActors[i].country;
         emails[i] = RegisteredActors[i].email;
         actorTypes[i] = RegisteredActors[i].actorType;

         voteCounts[i] = RegisteredActors[i].voteCount;
         latCenters[i] = RegisteredActors[i].voteCount;
         longCenters[i] = RegisteredActors[i].voteCount;
         yearsOfCreation[i] = RegisteredActors[i].voteCount;
         isValidateds[i] = RegisteredActors[i].voteCount;
         nbMintedAreas[i] = RegisteredActors[i].voteCount;
      }
      
      return (actorNames, countries, emails, actorTypes,voteCounts,latCenters,longCenters,yearsOfCreation,isValidateds,nbMintedAreas);
   }




   // TODO:
   // Mécanisme de vote avec proposals sous forme de texte: TO BE DISCUSSED
   // Mécanisme de vote permettant l'acceptation d'un nouvel acteur

   //Voting for a new actor
   //TO DO: can only vote once for an actor
   //TO DO: vote for multiple actors at once
   function votingForActor (uint actor_id) external 
   { 
      require(RegisteredActors[msg.sender].isRegistered == true);
      require(actor_id >=0 && actor_id <= actorCount-1);
      RegisteredActors[_address].voteCount++; //actor_id?
      //to be done
      emit votedEvent(actor_id);
   }


   //Function to validate an actor. Number of votes to be defined
   function validateActor() public {
      require(RegisteredActors[msg.sender].isRegistered == true);
      if (RegisteredActors[msg.sender].voteCount >=10) {
         RegisteredActors[msg.sender].isValidated = true;
      } 
   }



   //TO DO: see with Julien, what do we want here?
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
*/
}

