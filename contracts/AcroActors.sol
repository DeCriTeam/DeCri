// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2; // A voir si on l'utilise (pour récupérer tableau dans front)

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Acro.sol";

/** @title Dabase of self-registering actors */
contract AcroActors is Ownable {
   
   //TO be cleaned and optimized //cf order of variables (to be changed in addActors.js)
   ////To be completed (uint nb MintedArea?)
   struct Actor {
      bool isRegistered;
      uint id; //is it really usefull?
      string actorName;
      string country; 
      int latCenter; //can be negative
      int longCenter; //can be negative
      uint yearOfCreation; // year of birth of NGO 
      string email;
      string actorType; // NGO, Diving Club, Researcher
      string dateOfRegistration;  
      
      
   }

   uint actorCount = 0; //to keep track of the number of actors and to generate a unique ID

   mapping(address => Actor) public RegisteredActors;
   mapping(address => bool) public actors_whitelist;
   mapping(address => uint) public actors_score_whitelist;
   mapping(address => mapping(address => bool)) public already_vote;

   //TO ADD: Nb of minted area - mapping

   address[] public actors;
   Actor[] public actors_infos;
   Acro public acro_contract;

   /// @dev Acro contract address is set on this contract during deployment
   /// @param _acro_contract Acro contract address
   
   constructor(Acro _acro_contract) {
     acro_contract = _acro_contract;
     actors_whitelist[msg.sender] = true;
   }
 
   /// @dev get if an actor is on the registered
   /// @param addr actor'address
   /// @return true or false
   function is_registered(address addr) external view returns (bool) {
      bool isreg = RegisteredActors[addr].isRegistered;
        return isreg;
   }

   /// @dev get if an actor is on the whitelist, i.e. has been validated by amount of votes (actor already registered)
   /// @param addr actor'address
   /// @return true or false
   function is_actor(address addr) external view returns (bool) { //confusing iswhitelisted instead, change later because of Front!
     return actors_whitelist[addr];
   }

   /// @dev get an actor'id
   /// @param addr actor'address
   /// @return uint id
   function get_actor_id(address addr) external view returns (uint) {
      return RegisteredActors[addr].id;
   }

   /// @dev get a registered actor'voting score. 
   /// @param addr actor'address
   /// @return uint score which is defined according to the number of voters and their weight
   function get_actors_score_whitelist(address addr) external view returns (uint) {
      return actors_score_whitelist[addr];
   }

   /// @dev get actors'information to be displayed on the UI
   /// @return table of all registered actors
   function get_actors_info() public view returns(Actor[] memory){
      return actors_infos;
   }


   //List of events
   event ActorRegistered(address actorAddress);
   event ActorDeleted(address actorAddress); // à conserver ?
   event votedEvent(address actorAddress); //several actors at once?
   event ActorIsValided(address actorAddress);

   /// @dev Add a new actor to the database, anybody can add a new actor (one at once)
   /// requires that the address has not already been recorded
   /// @param _address actor'address
   /// @param _actorName actor'name
   /// @param _country actor'country
   /// @param _latCenter latitude of actor'physical address
   /// @param _longCenter longitude of actor'physical address
   /// @param _yearOfCreation year of creation of actor'oganization
   /// @param _actorType type of actor: NGO, Diving Club, Researcher
   /// @param date date of registration
   function add_new_actor(address _address,
                          string memory _actorName,
                          string memory _country,
                          int _latCenter, //can be negative
                          int _longCenter, //can be negative
                          uint _yearOfCreation,
                          string memory _email,
                          string memory _actorType,
                          string memory _date
                          ) public {
      require(RegisteredActors[_address].isRegistered != true,"This address is already registered");
      RegisteredActors[_address] = Actor(true, actorCount,_actorName, _country,_latCenter, _longCenter,  _yearOfCreation,_email,_actorType,_date); //DATE A VOIR
      actors_infos.push(RegisteredActors[_address]);
      actors.push(_address);
      actorCount++;
      emit ActorRegistered(_address);
   }

  
   //TO DO LATER: add a minimum delay of staking, i.e. at least a month
   // Warning: amount to be decided

   /// @dev Calculation of voting coefficient according to the actor'staking balance
   /// this coefficient is used in the votingForActor function
   /// @param addr actor'address
   /// @return uint coefficient
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

   /// @dev Allows to vote for an actor. Only a registered actor can vote for another actor.
   /// The voter cannot vote for a non-registered actor, he cannot vote for himself
   /// The voter can vote only once for an actor.
   /// @param addr actor'address for who the voter wants to vote
   function votingForActor(address actor_address) external { 
      require(RegisteredActors[msg.sender].isRegistered == true);
      require(RegisteredActors[actor_address].isRegistered == true);
      require(msg.sender != actor_address);
      require(already_vote[msg.sender][actor_address] == false);

      uint coef_vote = votingCoefficient(msg.sender);
      //A voir car si zero il ne faudrait pas l'enregistrer sur already_vote
      actors_score_whitelist[actor_address] = actors_score_whitelist[actor_address] + (1*coef_vote);

      already_vote[msg.sender][actor_address] = true;
      emit votedEvent(actor_address);
   }


   // TO DO Number of votes to be defined - May be change the way (i.e. include directly in votingForActor)
   /// @dev The administrator can validate a registered actor according to its score
   /// only registered actors can be validated
   /// @param addr actor'address to be validated
   function validateActor(address actor_address) public onlyOwner {
      require(RegisteredActors[actor_address].isRegistered == true);
      
      if (actors_score_whitelist[actor_address] > 2) { // !!! NUMBER TO BE SPECIFIED, set low here for testing purpose. FUNCTION?
         actors_whitelist[actor_address] = true;
         emit ActorIsValided(actor_address);
      } 
   }



   //
   

   
// */
}

