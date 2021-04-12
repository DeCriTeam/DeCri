import React, { useContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import CardDeck from "react-bootstrap/CardDeck";
import Card from 'react-bootstrap/Card';
import Web3Context from "./Web3context";

function Data() {
  const web3Context = useContext(Web3Context);
  const {
    lagoon_contract
  } = web3Context;

  const [items, setItems] = useState([]);

  async function refresh() {
     // TODO: Récupérer la liste de tous les Lags qui sont associés à un terrain réel
     try {
       var token_count = await lagoon_contract.methods.get_tokens_count().call();
       var _items = [];
       for (var i=0;i<token_count;i++) {
         var url_json = await lagoon_contract.methods.uri(i+1).call();
         let response = await fetch(url_json);
         var responseJson = await response.json();
         responseJson.url_json = url_json;
         _items.push(responseJson);
       }
       setItems(_items);
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  useEffect(() => { refresh(); }, []);

  // TODO: Masquer lien si nous ne sommes pas en présence d'un acteur référencé
  // TODO: Agencement des cartes ci dessous (à la ligne)
  // TODO: Personnaliser les actions selon le contexte du token
  // TODO: Paramétrage pour afficher uniquement mes lags ou la totalité
  return (
      <>
        <h2>Zones</h2>
        <CardDeck>
        {items.map((item, index) => {
          return (
            <Card style={{ width: '18rem' }} key={index}>
              <Card.Img variant="top" src={item.image} width="100" height="180" />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Button variant="primary">Transférer</Button>
                <a href={item.url_json} target="_blank" rel="noopener noreferrer">Metadatas</a>
              </Card.Body>
            </Card>
          )
        })}
        </CardDeck>

        <h2>Déclarer une nouvelle zone</h2>
        <div>
	  <a href="/add_data">Déclarer une nouvelle zone</a>
	</div>
      </>
  );
}

export default Data;
