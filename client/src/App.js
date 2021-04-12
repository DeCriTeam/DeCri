import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from "react-bootstrap/Container";
import 'bootstrap/dist/css/bootstrap.min.css';

import Web3Context from "./Web3context";

import AcroContract from "./contracts/Acro.json";
import DatabaseContract from "./contracts/AcroActors.json";
import LagoonContract from "./contracts/Lagoon.json";

import getWeb3 from "./getWeb3";

import Home from './Home';
import Play from './Play';
import Acro from './Acro';
import Actors from './Actors';
import Data from './Data';
import AddData from './AddData';

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [acro_contract, setAcroContract] = useState(null);
  const [database_contract, setDatabaseContract] = useState(null);
  const [lagoon_contract, setLagoonContract] = useState(null);

  async function init() {
     try 
     {
       const web3 = await getWeb3();
       const accounts = await web3.eth.getAccounts();

       const networkId = await web3.eth.net.getId();

       setAccount(accounts[0]);
       var deployedNetwork = AcroContract.networks[networkId];
       setAcroContract(new web3.eth.Contract(AcroContract.abi, deployedNetwork && deployedNetwork.address)); 

       deployedNetwork = DatabaseContract.networks[networkId];
       setDatabaseContract(new web3.eth.Contract(DatabaseContract.abi, deployedNetwork && deployedNetwork.address)); 

       deployedNetwork = LagoonContract.networks[networkId];
       setLagoonContract(new web3.eth.Contract(LagoonContract.abi, deployedNetwork && deployedNetwork.address)); 
       setWeb3(web3);
     }
     catch (error)
     {
       alert(`Failed to load web3, accounts, or contract. Check console for details.`);
       console.error(error);
     }
  };

  window.ethereum.on("accountsChanged", async function () {
     const accounts = await window.ethereum.enable();
     setAccount(accounts[0]);
  });

  useEffect(() => { init(); }, []);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
     <BrowserRouter>
       <div className="App">
         <Web3Context.Provider value={{ web3, account, acro_contract, database_contract, lagoon_contract }}>
           <Navbar bg="light" expand="lg">
             <Navbar.Brand href="/">
               <img src='/logo.png' width='30' height='30' className="d-inline-block align-top" style={{ marginRight:10 +'px'}} alt="Decri logo" />
               Decri
             </Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav" />
             <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="mr-auto"> 
                 <Nav.Link href='/'>Accueil</Nav.Link>
                 <Nav.Link href='/acro'>Acheter (Acro)</Nav.Link>
                 <Nav.Link href='/actors'>Acteurs</Nav.Link>
                 <Nav.Link href='/data/me'>Mes LAGs</Nav.Link>
                 <Nav.Link href='/data/all'>Datas</Nav.Link>
               </Nav>
               <Nav> 
                 <Nav.Link href='#'>{ account }</Nav.Link>
               </Nav>
             </Navbar.Collapse>
           </Navbar>
           <Container>
             <Switch>
               <Route path='/' exact component={Home} />
               <Route path='/acro' component={Acro} />
               <Route path='/actors' component={Actors} />
               <Route path='/play/:token_id' component={Play} />
               <Route path='/data/:plags' component={Data} />
               <Route path='/add_data' component={AddData} />
             </Switch>
           </Container>
         </Web3Context.Provider>
       </div>
     </BrowserRouter>
  );
}

export default App;
