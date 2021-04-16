import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from "react-bootstrap/Container";
import 'bootstrap/dist/css/bootstrap.min.css';

import Web3Context from "./Web3context";

import AcroContract from "./contracts/Acro.json";
import ActorsContract from "./contracts/AcroActors.json";
import LagoonContract from "./contracts/Lagoon.json";

import getWeb3 from "./getWeb3";

import Home from './Home';
import Play from './Play';
import Acro from './Acro';
import Actors from './Actors';
import AddActors from './AddActors.js';
import Data from './Data';
import AddData from './AddData';
import AddState from './AddState';

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [acro_contract, setAcroContract] = useState(null);
  const [actors_contract, setActorsContract] = useState(null);
  const [lagoon_contract, setLagoonContract] = useState(null);
  const [is_actor, setIsActor] = useState(null);

  async function init() {
     try 
     {
       const web3 = await getWeb3();
       const accounts = await web3.eth.getAccounts();

       const networkId = await web3.eth.net.getId();

       setAccount(accounts[0]);

       var deployedNetwork = AcroContract.networks[networkId];
       setAcroContract(new web3.eth.Contract(AcroContract.abi, deployedNetwork && deployedNetwork.address));

       deployedNetwork = ActorsContract.networks[networkId];
       let _actors_contract = new web3.eth.Contract(ActorsContract.abi, deployedNetwork && deployedNetwork.address);
       setActorsContract(_actors_contract);

       deployedNetwork = LagoonContract.networks[networkId];
       setLagoonContract(new web3.eth.Contract(LagoonContract.abi, deployedNetwork && deployedNetwork.address));

       setWeb3(web3);

       setIsActor(await _actors_contract.methods.is_validated_actor(accounts[0]).call());
     }
     catch (error)
     {
       alert(`Failed to load web3, accounts, or contract. Check console for details.`);
       console.error(error);
     }
  };

  window.ethereum.on("accountsChanged", async function () {
     window.location = window.location.href;
  });

  useEffect(() => { init(); }, []);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
     <BrowserRouter>
       <div className="App">
         <Web3Context.Provider value={{ web3, account, acro_contract, actors_contract, lagoon_contract }}>
           <Navbar bg="light" expand="lg">
             <Navbar.Brand href="/">
               <img src='/logo.png' width='30' height='30' className="d-inline-block align-top" style={{ marginRight:10 +'px'}} alt="Decri logo" />
               Decri
             </Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav" />
             <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="mr-auto"> 
                 <Nav.Link href='/'>Home</Nav.Link>
                 <Nav.Link href='/acro'>Acro</Nav.Link>
                 <Nav.Link href='/actors'>Actors</Nav.Link>
                 <Nav.Link href='/data/me'>My LAGs</Nav.Link>
                 { is_actor && (<Nav.Link href='/data/all'>Datas</Nav.Link>) }
               </Nav>
               <Nav> 
                 <Nav.Link href='#'>{ account } { is_actor?("[Validated actor]"):("") }</Nav.Link>
               </Nav>
             </Navbar.Collapse>
           </Navbar>
           <Container>
             <Switch>
               <Route path='/' exact component={Home} />
               <Route path='/acro' component={Acro} />
               <Route path='/actors' component={AddActors} />
               <Route path='/play/:token_id' component={Play} />
               <Route path='/data/:plags' component={Data} />
               <Route path='/add_data' component={AddData} />
               <Route path='/add_state/:token_id' component={AddState} />
             </Switch>
           </Container>
         </Web3Context.Provider>
       </div>
     </BrowserRouter>
  );
}

export default App;
