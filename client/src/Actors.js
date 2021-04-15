import React, { useContext, useState, useEffect } from "react";
import Web3Context from "./Web3context";

function Actors() {
  const web3Context = useContext(Web3Context);
  const {
    lagoon_contract
  } = web3Context;

  const [items, setItems] = useState([]);

  async function refresh() {
     /*
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
     */
  };

  useEffect(() => { refresh(); }, []);

  return (
      <>
        <h2>Acteurs</h2>
        {items.map((item, index) => {
          return ( {item} )
        })}

       
      </>
  );
}

export default Actors;
