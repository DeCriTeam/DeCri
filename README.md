# DeCRI - Decentralized Coral Reef Initiative

> Get part of a community that wants to preserve and restore the coral reefs throughout the world!

## Contributors

- [Deborah Bourgeade] Product Owner, Blockchain Project Officer
- [Leo Leclerc] Scrum Master, Blockchain Project Officer
- [Julien Bonneton]Chief Development Officer, Full-stack developer
- [Mélanie Béguer-Pon] Chief Development Officer, Solidity Developer, Biologist - Scientific Advisor
 
## Description

- Actors involved in coral reefs management register themself in the Actor database. Each actor are validated by the community once the threeshold of 80% of votes from the validated actors is reached.
- Acro tokens can be bought. Actors must buy and lock Acro tokens to be able to vote. Acro tokens are also used to buy game items for our Coral Bay game (see below). Anybody can donate Acro tokens to our fundation or to validated actors.
- Validated actors can tokenize coral reef zones from their physical area (in the real world!) by registering them on our application (100 SFT per area are minted). Once created, these SFT,named LAG, can be transfered, bought and sold. 
- By buying SFT, donations are made to valided actors so they can make actions in the real world.
- Users can buy SFT to play at our game named "Coral Bay". The goal of this game is to improve the state of the coral reef area by adding items (corals, fish etc.), these items can be bought with Acro tokens.

## Licence
DeCRI is released under the terms of the MIT license.
See COPYING for more information or https://opensource.org/licenses/MIT .


## Links

* [Open Application] (https://decri.herokuapp.com/)

## Progression
* Version #1 fully-developped
* Further versions to be developped

## Langage 
* Solidity
* Javascript

## Architecture

The DeCRI Project is composed of 2 parts:

- **Back-End**:  
    **Ethereum smart-contracts**, written in Solidity, are deployed on the Rinkeby testnet.
- **Front-End** (DApp):  
    A **ReactJS client app** written in ReactJS and deployed on Heroku. It  provides the User Interface to interact with the contracts.

### Back-End

The back-end is compoosed of the following Ethereum **smart-contracts**:

- [`Acro`](contracts/acro.sol) This smart-contract produces the ERC-20 token named ACRO. It also:
    -allows users to buy ACROs and donate ACROs to this contract
    -allows users to lock and unlock their ACROs for a certain period of time
    -allows owner to withdraw acro and ether from this contract.

- [`AcroActors`](contracts/AcroActors.sol) This smart-contract allows:
    - actors involved in coral reefs to register themself in our database
    - registered actors to be validated by the community (i.e. actors vote for other actors)

- [`Lagoon`](contracts/Lagoon.sol) This smart-contract allows:
    - validated actors to mint their SFT (ERC-1155) (i.e. to declare a new physical coral zone in the database)
    - validated actors to modify the state for an existing physical coral zone in the database
    - any user to create a new game party (virtual zone)
    - any user can merge one of his real token with one of his virtual zone
    - any user to buy and add item for our game and put it on a virtual zone
    - automatic level increase for a virtual zone when a user adds items on it
    - getting serialized datas for a given virtual zone


### Front-End

Our **DApp** is a **Front-End** application written in **ReactJS** and deployed on Heroku.


# Interactions
A diagram allowing the vizualization of smart-contracts'interactions is available here: [diagram] (https://github.com/DeCriTeam/DeCri/blob/5a593d0db5345ef1d688785f56989c292cf9bf8e/contracts.svg)

# Security
We tried to make our smart-contracts as resistant as possible to common attacks and potential hacks.  
[Read more...](doc/avoiding_common_attacks.md)

# Install

```
git clone https://github.com/DeCriTeam/DeCri.git
cd Decri
```

## Configure

```
npm install

cd client
npm install
```

npm install @truffle/hdwallet-provider

In order to deploy to the test networks or the main network you need to:

- Create a `.env` file in the project's root folder  
- Edit `.env` and set the below `property = "value"` pairs (one per line):

```
MNEMONIC = "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
INFURA_URL = "https://rinkeby.infura.io/v3/your_infura_project_id_here"
```

## Compile and Deploy

```
truffle deploy --reset --network ganache

```

## Run

cd client
npm run start


## Test

Run ganache on port 7545.

```
truffle deploy --reset --network ganache


truffle test test/tokenAcro.test.js
truffle test test/actors.test.js
truffle test test/lagoon.test.js

```

# Deploying on test net
```
truffle migrate --network rinkeby --reset

```

# Documentation
Each smart-contract is documented in a Markdown file in `client/src/contracts`.

## Design pattern decisions
[Read more...](design_pattern_desicions.md)

## Deployed addresses
The 3 smart-contracts have been deployed on the Rinkeby testnet.
Deployed address are available [here](deployed_addresses.md)


