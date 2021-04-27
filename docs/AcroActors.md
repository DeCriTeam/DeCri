## `AcroActors`






### `constructor(contract Acro _acro_contract)` (public)



Acro contract address is set on this contract during deployment


### `add_new_actor(address addr, struct AcroActors.Actor actor)` (public)



Add a new actor to the database, anybody can add a new actor (one at once)
requires that the address has not already been recorded


### `is_validated_actor(address addr) → bool` (external)



get if an actor is on the registered


### `get_actors_count() → uint256` (external)

get registred actors array count




### `get_validated_actors_count() → uint256` (public)



get the count of validated actors
the function is use in the function votingForActor


### `votingCoefficient(address addr) → uint256` (public)



Calculation of voting coefficient according to the actor'staking balance
this coefficient is used in the votingForActor function


### `votingForActor(address actor_address)` (external)



Allows to vote for an actor. Only a validated actor can vote for another actor.
The voter cannot vote for a non-registered actor, he cannot vote for himself
The voter can vote only once for an actor.
An actor is automatically validated if its score is greater or equal to 80% of the voting actors



### `ActorRegistered(address actorAddress)`





### `votedEvent(address actorAddress)`





### `ActorIsValided(address actorAddress)`





