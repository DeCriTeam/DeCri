import React, { useContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import CardDeck from "react-bootstrap/CardDeck";
import Web3Context from "./Web3context";
import LagCard from "./LagCard";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'

function Data() {
  const { plags } = useParams();
  const web3Context = useContext(Web3Context);
  const {
    lagoon_contract,
    account
  } = web3Context;

  const [items, setItems] = useState([]);

  async function refresh() {
     // TODO: Récupérer la liste de tous les Lags qui sont associés à un terrain réel
     try {
       var token_count = await lagoon_contract.methods.get_tokens_count().call();
       var _items = [];
       for (var i=0;i<token_count;i++) {
         var url_json = await lagoon_contract.methods.uri(i+1).call();
         var json_item = {}
         if (url_json!='') {
            let response = await fetch(url_json);
            json_item = await response.json();
         }

         json_item.url_json = url_json;
         json_item.token_id = (i+1)
         json_item.lagoon_type = await lagoon_contract.methods.lagoon_types(i+1).call();
         json_item.my_balance = await lagoon_contract.methods.balanceOf(account, i+1).call();

         _items.push(json_item);
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

  async function on_btn_new_game_click() {
     try
     {
        var token_id = await lagoon_contract.methods.new_virtual_zone().send({ from: account });
        console.log(token_id); // TODO: Récup le retour
        token_id = await lagoon_contract.methods.get_tokens_count().call();
        window.location = '/play/' + token_id;
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };


  // TODO: Masquer lien si nous ne sommes pas en présence d'un acteur référencé
  // TODO: Agencement des cartes ci dessous (à la ligne)
  // TODO: Personnaliser les actions selon le contexte du token
  // TODO: Paramétrage pour afficher uniquement mes lags ou la totalité
  return (
      <>
        { (plags==='me') ? ( 
            <h2>Mes lags</h2>
          ) : (
            <h2>Zones</h2>
          )
        }
        <CardDeck>
        {items.map((item, index) => {
          return (
            <LagCard item={item} key={index} />
          )
        })}
        </CardDeck>

        <h2>Déclarer une nouvelle zone réelle</h2>
        <div>
          <a href="/add_data">Déclarer une nouvelle zone réelle</a>
        </div>

        <h2>Nouvelle partie</h2>
        <div>
          <a href="#" onClick={on_btn_new_game_click}>Nouvelle partie</a>
        </div>
      </>
  );
}

export default Data;
