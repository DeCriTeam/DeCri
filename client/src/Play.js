import React, { useContext, useState, useEffect } from "react";
import Web3Context from "./Web3context";
import { useParams } from "react-router-dom";

function Play() {
  const { token_id } = useParams();
  const web3Context = useContext(Web3Context);
  const {
    acro_contract,
    lagoon_contract,
    account
  } = web3Context;

  const [level, setLevel] = useState(0);

  async function refresh() {
     try {
          setLevel(await lagoon_contract.methods.get_game_level(token_id).call({ from: account }));
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  async function on_btn_test_click() {
     try
     {
        console.log('Lag: ');
	     console.log(lagoon_contract._address);
        await acro_contract.methods.approve(lagoon_contract._address, '100000000000000000').send({ from: account });
	await lagoon_contract.methods.buy_and_put_game_item(token_id, 0, 0, 0).send({ from: account });
        await refresh();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };


  useEffect(() => {
    const script = document.createElement('script');
    script.src = "/game_client.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  return (
      <>
        <h1>Jeu { token_id } - Level: {level} </h1>
        <div align="center">
          <canvas id="canvas_jeu" style={{ backgroundColor: 'black' }} width="800" height="600"></canvas>
        </div>
        <button onClick={on_btn_test_click}>Test</button>
      </>
  );
}

export default Play;
