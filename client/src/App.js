import React, { Component } from "react";
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

class App extends Component {
  state = { 
    web3:null,
    account:null,
    acro_contract:null,
  };

  componentDidMount = async () => {
/*
     try 
     {
       const web3 = await getWeb3();
       const accounts = await web3.eth.getAccounts();

       const networkId = await web3.eth.net.getId();
       const deployedNetwork = AcroContract.networks[networkId];

       this.setState({ 
         web3,
         account: accounts[0],
         acro_contract: new web3.eth.Contract(AcroContract.abi, deployedNetwork && deployedNetwork.address) 
       });
     }
     catch (error)
     {
       alert(`Failed to load web3, accounts, or contract. Check console for details.`);
       console.error(error);
     }
*/
  };

  render() {
  //  if (!this.state.web3) {
  //    return <div>Loading Web3, accounts, and contract...</div>;
  //  }
    return (
     <BrowserRouter>
       <div className="App">
         <Web3Context.Provider value={( this.state.account, this.state.acro_contract )}>
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
                 <Nav.Link href='#'>{ this.state.account }</Nav.Link>
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
}

export default App;
