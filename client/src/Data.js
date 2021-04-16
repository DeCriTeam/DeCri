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

  const [real_items, setRealItems] = useState([]);
  const [virtual_items, setVirtualItems] = useState([]);

  async function refresh() {
     // TODO: Récupérer la liste de tous les Lags qui sont associés à un terrain réel
     try {
       var token_count = await lagoon_contract.methods.get_tokens_count().call();
       var _virtual_items = [];
       var _real_items = [];
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
console.log(json_item.lagoon_type);


         if (plags=='me' && json_item.my_balance==0) {
	 } else {
           if (json_item.lagoon_type==0) {
              _virtual_items.push(json_item);
           } else {
              _real_items.push(json_item);
           }
           // TODO: Both items
         }
       }

       setVirtualItems(_virtual_items);
       setRealItems(_real_items);
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
          <>
            <h2>My LAGSs</h2>
            <CardDeck>
            {real_items.map((item, index) => {
               return (
                 <LagCard item={item} key={index} />
               )
            })}
            </CardDeck>
            &nbsp;
            <CardDeck>
            {virtual_items.map((item, index) => {
               return (
                 <LagCard item={item} key={index} />
               )
            })}
            </CardDeck>
            <a href="#" onClick={on_btn_new_game_click}>Start new game</a>
          </>
          ) : (
          <>
            <h2>Zones database</h2>
            <a href="/add_data">Declare a new zone</a>
            <CardDeck>
            {real_items.map((item, index) => {
               return (
                 <LagCard item={item} key={index} />
               )
            })}
            </CardDeck>
          </>
          )
        }
      </>
  );
}

export default Data;
