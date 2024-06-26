// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Acro.sol";

/** @title Dabase of self-registering actors */
contract AcroActors {

   event ActorRegistered(address actorAddress);
   event votedEvent(address actorAddress);
   event ActorIsValided(address actorAddress);

   enum ActorTypes { NGO, DIVING_CLUB, RESEARCHER }
   
   struct Actor {
      bool isRegistered;
      bool isValidated;
      string actorName;
      string country; 
      int latCenter; //can be negative
      int longCenter; //can be negative
      uint yearOfCreation; // year of birth of NGO 
      string email;
      ActorTypes actorType;
      string dateOfRegistration;  
      uint vote_score;
   }

   mapping(address => Actor) public RegisteredActors;
   address[] public actors;
   mapping(address => mapping(address => bool)) private already_vote;
   Acro private acro_contract;

   /// @dev Acro contract address is set on this contract during deployment
   /// @param _acro_contract Acro contract address
   constructor(Acro _acro_contract) {
     acro_contract = _acro_contract;

     add_new_actor(msg.sender, Actor({
       isRegistered: true,
       isValidated: true,
       actorName: "Decri Team",
       country: "France",
       latCenter: 0,
       longCenter: 0,
       yearOfCreation: 2021,
       email: "julien.crypt@gmail.com",
       actorType: ActorTypes.NGO,
       dateOfRegistration: "",
       vote_score: 0}));

     add_new_actor(0x50BB734240C657d5da3EacF43195070b6EFFD70a, Actor({
       isRegistered: true,
       isValidated: true,
       actorName: "Julien",
       country: "France",
       latCenter: 0,
       longCenter: 0,
       yearOfCreation: 2021,
       email: "julien.crypt@gmail.com",
       actorType: ActorTypes.NGO,
       dateOfRegistration: "",
       vote_score: 0}));

     add_new_actor(0x41edF7a963c717867C57b2c5199b78452E7a9985, Actor({
       isRegistered: true,
       isValidated: true,
       actorName: "Deborah",
       country: "France",
       latCenter: 0,
       longCenter: 0,
       yearOfCreation: 2021,
       email: "",
       actorType: ActorTypes.NGO,
       dateOfRegistration: "",
       vote_score: 0}));

     add_new_actor(0xE3648af1685C59FEA0DE947bF6f70d3dB8C83681, Actor({
       isRegistered: true,
       isValidated: true,
       actorName: "Leo",
       country: "France",
       latCenter: 0,
       longCenter: 0,
       yearOfCreation: 2021,
       email: "",
       actorType: ActorTypes.NGO,
       dateOfRegistration: "",
       vote_score: 0}));

     add_new_actor(0x4B079e0D870b10c2EB64231f90FAfB4D330938Ce, Actor({
       isRegistered: true,
       isValidated: true,
       actorName: "Melanie",
       country: "France",
       latCenter: 0,
       longCenter: 0,
       yearOfCreation: 2021,
       email: "",
       actorType: ActorTypes.NGO,
       dateOfRegistration: "",
       vote_score: 0}));

       RegisteredActors[msg.sender].isValidated = true;
       RegisteredActors[0x50BB734240C657d5da3EacF43195070b6EFFD70a].isValidated = true;
       RegisteredActors[0x41edF7a963c717867C57b2c5199b78452E7a9985].isValidated = true;
       RegisteredActors[0xE3648af1685C59FEA0DE947bF6f70d3dB8C83681].isValidated = true;
       RegisteredActors[0x4B079e0D870b10c2EB64231f90FAfB4D330938Ce].isValidated = true;
   }

   /**
     * @dev Add a new actor to the database, anybody can add a new actor (one at once)
     * requires that the address has not already been recorded
     * @param addr Actor's wallet address
     * @param actor Actor's informations
     */
   function add_new_actor(address addr, Actor memory actor) public {
      require(RegisteredActors[addr].isRegistered==false,"Actor already registered");
      actor.isRegistered = true;
      actor.isValidated = false;
      actor.vote_score = 0;
      RegisteredActors[addr] = actor;
      actors.push(addr);
      emit ActorRegistered(addr);
   }
 
   /// @dev get if an actor is on the registered
   /// @param addr actor'address
   /// @return true or false
   function is_validated_actor(address addr) external view returns (bool) {
      return RegisteredActors[addr].isValidated;
   }

   /**
     * @notice get registred actors array count
     * @return actors count
     */
   function get_actors_count() external view returns (uint) {
      return actors.length;
   }

  
   /// @dev get the count of validated actors
   /// the function is use in the function votingForActor
   /// @return uint number of validated actors
   function get_validated_actors_count() public view returns (uint){
      uint validatedActorsCount = 0;
      for (uint i = 0; i < actors.length; i++) {
         address addr = actors[i];
         if (RegisteredActors[addr].isValidated == true)
         {
            validatedActorsCount++;
         }
      }

      return validatedActorsCount;
   }
  
   /// @dev Calculation of voting coefficient according to the actor'staking balance
   /// this coefficient is used in the votingForActor function
   /// @param addr actor'address
   /// @return uint coefficient
   function votingCoefficient(address addr) public view returns(uint)
   {
      uint coef = 0;

      if (acro_contract.staking_balance(addr) >= 10000000000000000000)//10 acros 
      {
         coef = 1;
      }
     
      return uint(coef);
   }

   /// @dev Allows to vote for an actor. Only a validated actor can vote for another actor.
   /// The voter cannot vote for a non-registered actor, he cannot vote for himself
   /// The voter can vote only once for an actor.
   /// An actor is automatically validated if its score is greater or equal to 80% of the voting actors
   /// @param actor_address actor'address for who the voter wants to vote
   function votingForActor(address actor_address) external { 
      require(RegisteredActors[msg.sender].isValidated == true,"Voter must be validated");
      require(RegisteredActors[actor_address].isRegistered == true,"Unknown actor");
      require(msg.sender != actor_address,"Actor cannot vote for himself");
      require(already_vote[msg.sender][actor_address] == false,"Alread vote for this actor");

      uint coef_vote = votingCoefficient(msg.sender);
      
      RegisteredActors[actor_address].vote_score += (1*coef_vote);

      already_vote[msg.sender][actor_address] = true;
      emit votedEvent(actor_address);

      uint NbValidatedActors = get_validated_actors_count();
      
      if ((RegisteredActors[actor_address].vote_score*100) >= NbValidatedActors*80) {
         RegisteredActors[actor_address].isValidated = true;
         emit ActorIsValided(actor_address);
      }
   }
}
