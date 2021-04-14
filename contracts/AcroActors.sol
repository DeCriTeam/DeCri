// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2; // A voir si on l'utilise (pour récupérer tableau dans front)

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Acro.sol";


contract AcroActors is Ownable {
   
   //struc limited to 12 variables apparently ? 
   struct Actor {
      bool isRegistered;
      uint id; //!!to be added below & !!to be regrouped by var.cat. for optim
      // uint nbMintedArea; // to be put in a mapping instead?
      
      string dateOfRegistration; // ? do we put that - CHECK variable type
      string actorName;
      string country;
      uint latCenter;
      uint longCenter;
      uint yearOfCreation; // year of birth of NGO ?
      string email; //type to be checked
      string actorType; // individual, NGO, diving club      
   }

   uint actorCount = 0; //to keep track of the number of actors and to generate a unique ID

   mapping(address => Actor) public RegisteredActors;
   mapping(address => bool) public actors_whitelist; //id instead?
   mapping(address => uint) public actors_score_whitelist;

   mapping(address => uint) public actors_registred_id; //Not needed
   mapping(address => bool) public isRegistered;
   mapping(address => mapping(address => bool)) public already_vote;

   //TO ADD: Nb of minted area - mapping

   address[] public actors;

   Acro public acro_contract;

   // Case without Acro contract
   // constructor() {
   //   actors_whitelist[msg.sender] = true;
   // }
   
   constructor(Acro _acro_contract) {
     acro_contract = _acro_contract;
     actors_whitelist[msg.sender] = true;
   }

   

   function is_actor(address addr) external view returns (bool) { //confusing iswhitelisted instead, change later because of Front!
     return actors_whitelist[addr];
   }

   function is_registered(address addr) external view returns (bool) {
      return isRegistered[addr];
   }

   function get_actor_id(address addr) external view returns (uint) {
      return actors_registred_id[addr];
   }

   function get_actors_score_whitelist(address addr) external view returns (uint) {
      return actors_score_whitelist[addr];
   }

 ////To DO:  get actors informations
 
// /*
  
   //List of events
   event ActorRegistered(address actorAddress);
   event ActorDeleted(address actorAddress); // à conserver
   event votedEvent(address actorAddress); //several actors at once?
   event ActorIsValided(address actorAddress);

   // To add new actors: anybody can add a new actor (one at once)
   function add_new_actor(address _address,
                          string memory _actorName,
                          string memory _country,
                          uint _latCenter,
                          uint _longCenter,
                          uint _yearOfCreation,
                          string memory _email, //type to be checked
                          string memory _actorType,
                          string memory date
                          ) public {
      require(RegisteredActors[_address].isRegistered != true,"This address is already registered"); // Doublon à voir
      require(isRegistered[_address] != true, "This address is already registered");
      RegisteredActors[_address] = Actor(true, actorCount,date, _actorName, _country,_latCenter, _longCenter,  _yearOfCreation,_email,_actorType); //DATE A VOIR
      actors.push(_address);
      actors_registred_id[_address] = actorCount;
      isRegistered[_address] = true;
      actorCount++;
      emit ActorRegistered(_address);
   }

  
   // Voter pour participer à la validation d'un acteur
   //TO DO: THAT ACTOR MUST BE STAKING SOME ACROS to vote, need to import Acro contract for that
   //TO DO LATER: add a minimum delay of staking, i.e. at least a month

   // Warning: amount to be decided, beware decimals
   function votingCoefficient(address addr) public view returns(uint)
   {
      uint coef = 0;
      if (acro_contract.staking_balance(addr) > 1) 
      {
         coef = 1;
      }
      else if (acro_contract.staking_balance(addr) > 50)
      {
         coef = 2;
      }
      return uint(coef);
   }

    function votingForActor(address actor_address) external { 
      require(RegisteredActors[msg.sender].isRegistered == true); //The user must be registered to vote
      require(RegisteredActors[actor_address].isRegistered == true); //not possible to vote for a non-registered actor
      require(msg.sender != actor_address); // a user cannot vote for himself
      require(already_vote[msg.sender][actor_address] == false); //Actor can only vote once for an actor

      uint coef_vote = votingCoefficient(msg.sender);
      // actors_score_whitelist[actor_address] = (actors_score_whitelist[actor_address] + coef_vote); //A voir car si zero il ne faudrait pas l'enregistrer sur already_vote
      
      actors_score_whitelist[actor_address] = actors_score_whitelist[actor_address] + (1*coef_vote);

      // actors_score_whitelist[actor_address]++;
      already_vote[msg.sender][actor_address] = true;
      emit votedEvent(actor_address);
   }


   //Function to validate an actor. Number of votes to be defined - Admin only
   // TO DO: validate several actor at once
   function validateActor(address actor_address) public onlyOwner {
      require(RegisteredActors[actor_address].isRegistered == true); //Only registered Actors can be validated
      
      if (actors_score_whitelist[actor_address] > 2) { // !!! NUMBER TO BE SPECIFIED, set low here for testing purpose. FUNCTION?
         actors_whitelist[actor_address] = true;
         emit ActorIsValided(actor_address);
      } 
   }



   //
   

   
// */
}

