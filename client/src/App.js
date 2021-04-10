import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

import Web3Context from "./Web3context";

import AcroContract from "./contracts/Acro.json";
import getWeb3 from "./getWeb3";

import Home from './Home';
import Jeu from './Jeu';
import Dons from './Dons';
import Data from './Data';

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [acro_contract, setAcroContract] = useState(null);

  async function init() {
     try 
     {
       const web3 = await getWeb3();
       const accounts = await web3.eth.getAccounts();

       const networkId = await web3.eth.net.getId();
       const deployedNetwork = AcroContract.networks[networkId];

       setAccount(accounts[0]);
       setAcroContract(new web3.eth.Contract(AcroContract.abi, deployedNetwork && deployedNetwork.address)); 
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
         <Web3Context.Provider value={{ web3, account, acro_contract }}>
           <Navbar bg="light" expand="lg">
             <Navbar.Brand href="/">
               <img src='/logo.png' width='30' height='30' className="d-inline-block align-top" style={{ marginRight:10 +'px'}} alt="Decri logo" />
               Decri
             </Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav" />
             <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="mr-auto"> 
                 <Nav.Link href='/'>Accueil</Nav.Link>
                 <Nav.Link href='/jeu'>Jeu</Nav.Link>
                 <Nav.Link href='/dons'>Dons</Nav.Link>
                 <Nav.Link href='/data'>Inventaire</Nav.Link>
               </Nav>
               <Nav> 
                 <Nav.Link href='#'>{ account }</Nav.Link>
               </Nav>
             </Navbar.Collapse>
           </Navbar>
           <Switch>
             <Route path='/' exact component={Home} />
             <Route path='/jeu' component={Jeu} />
             <Route path='/dons' component={Dons} />
             <Route path='/data' component={Data} />
           </Switch>
         </Web3Context.Provider>
       </div>
     </BrowserRouter>
  );
}

export default App;
