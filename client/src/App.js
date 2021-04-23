import React, { useState, useEffect } from "react";
import { Link, BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';
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



const App = () => {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [metamask_installed, setMetamaskInstalled] = useState(null);
  const [chain_id, setChainId] = useState(null);
  const [acro_contract, setAcroContract] = useState(null);
  const [actors_contract, setActorsContract] = useState(null);
  const [lagoon_contract, setLagoonContract] = useState(null);
  const [is_actor, setIsActor] = useState(null);

  const callback_event_ref = React.useRef();
  async function callback_event(event) {
    console.log(account);
    console.log(event);
  }
  callback_event_ref.current = callback_event;

  async function init() {
     try 
     {
       let _metamask_installed = (window.ethereum!==undefined);
       setMetamaskInstalled(_metamask_installed);
       if (_metamask_installed!==true) {
         return ;
       }

       const web3 = await getWeb3();
       const accounts = await web3.eth.getAccounts();
       const _chain_id = await web3.eth.getChainId();
       setChainId(_chain_id);

       const networkId = await web3.eth.net.getId();

       if (_chain_id===4) {
         setAccount(accounts[0]);

         var deployedNetwork = AcroContract.networks[networkId];
         let _acro_contract = new web3.eth.Contract(AcroContract.abi, deployedNetwork && deployedNetwork.address);
         _acro_contract.events.Transfer().on("data", (e) => callback_event_ref.current(e));
         setAcroContract(_acro_contract);

         deployedNetwork = ActorsContract.networks[networkId];
         let _actors_contract = new web3.eth.Contract(ActorsContract.abi, deployedNetwork && deployedNetwork.address);
         setActorsContract(_actors_contract);

         deployedNetwork = LagoonContract.networks[networkId];
         setLagoonContract(new web3.eth.Contract(LagoonContract.abi, deployedNetwork && deployedNetwork.address));

         setIsActor(await _actors_contract.methods.is_validated_actor(accounts[0]).call());

       }
       setWeb3(web3);

     }
     catch (error)
     {
       alert(`Failed to load web3, accounts, or contract. Check console for details.`);
       console.error(error);
     }
  };

  if (window.ethereum!==undefined) {
    window.ethereum.on("accountsChanged", async function () {
      window.location = window.location.href;
    });

    window.ethereum.on('chainChanged', (chainId) => {
      window.location = window.location.href;
    });
  }

  useEffect(() => { init(); }, []);
  if (metamask_installed!==true) {
    return <div>Please install metamask</div>
  }

  if (!web3) {
    return (<Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }

  if (chain_id!==4) {
    return <div>Please switch on Rinkeby network</div>
  }

  return (
     <BrowserRouter>
       <div className="App">
         <Web3Context.Provider value={{ web3, account, acro_contract, actors_contract, lagoon_contract, is_actor }}>
           <Navbar bg="light" expand="lg">
             <Navbar.Brand>
               <img src='/logo.png' width='30' height='30' className="d-inline-block align-top" style={{ marginRight:10 +'px'}} alt="Decri logo" />
               Decri
             </Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav" />
             <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="mr-auto"> 
                 {/* Nav.Link cause a full page refresh. We are using Link for SPA 
                 <Nav.Link href='/'>Home</Nav.Link> */}
                 <Link to='/' className="nav-link">Home</Link>
                 <Link to='/acro' className="nav-link">Acro</Link>
                 <Link to='/actors' className="nav-link">Actors</Link>
                 <Link to='/data/me' className="nav-link">My LAGs</Link>
                 <Link to='/data/all' className="nav-link">Coral Reef Areas database</Link>
                 {/*
                 <Link to={`https://testnets.opensea.io/assets/${ lagoon_contract._address }`} className='nav-link'>View on Opensea</Link>
                 */}
               </Nav>
               <Nav> 
                 { account } { is_actor?("[Validated actor]"):("") }
               </Nav>
             </Navbar.Collapse>
           </Navbar>
           <Container>
             <Switch>
               <Route path='/' exact component={Home} />
               <Route path='/acro' component={Acro} />
               <Route path='/actors' exact component={Actors} />
               <Route path='/actors/add' exact component={AddActors} />
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
