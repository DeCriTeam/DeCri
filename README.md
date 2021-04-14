# DeCRI - Decentralized Coral Reef Initiative

> Using the blockchain to help coral reefs in the real world!
 
## Description

- to do -> abstract of wp


## Links

* [Presentation] https://docs.google.com/presentation/d/1yiRUaE0X9yLE9HL7eQ68k8uhFjp5NLcDxX5vnXmV47E/edit#slide=id.gcf207230ce_0_0
https://docs.google.com/presentation/d/1Hxhd25u1_e6L1vMgsCxNFhaGa1qNxPxr8uHhT3BZyAg/edit?ts=6070168b#slide=id.gce4a5e4cc1_0_95
* [Wireframes](to do)
* [Github](https://github.com/DeCriTeam/DeCri.git)
* [DaPP Heroku](To do)
* [Trello](https://trello.com/b/5Z7bPydP/conduite-de-projet)
* [Website](to be added)
* [Whitepaper](to be added)
 

## Features

TODO


# Install

```
git clone https://github.com/DeCriTeam/DeCri.git
cd Decri
```

# Configure

```
npm install

cd client
npm install
```

In order to deploy to the test networks or the main network you need to:

- Create a `.env` file in the project's root folder  
- Edit `.env` and set the below `property = "value"` pairs (one per line):

```
MNEMONIC = word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
INFURA_ID = your_infura_project_id_here
```

# Compile

```
truffle compile
```

# Run

cd client
npm run start


# Test

Run ganache on port 7545.

```
truffle compile
truffle deploy --reset --network ganache
```
TOBECOMPLETED
truffle test test/tokenAcro.test.js
truffle test test/actors.test.js


# Deploying on test net
truffle migrate --network rinkeby --reset

# Documentation

Each smart-contract is documented in a Markdown file in `client/src/contracts`.


## Decisions

- to be done


```

</details>


