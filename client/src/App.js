import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home';
import Jeu from './Jeu';
import Dons from './Dons';
import Data from './Data';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
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
	         <Nav.Link href='#'>Connexion</Nav.Link>
	         <Nav.Link href='/inscription'>Inscription</Nav.Link>
	      </Nav>
	   </Navbar.Collapse>
	</Navbar>
        <Switch>
	  <Route path='/' exact component={Home} />
	  <Route path='/jeu' component={Jeu} />
	  <Route path='/dons' component={Dons} />
	  <Route path='/data' component={Data} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
