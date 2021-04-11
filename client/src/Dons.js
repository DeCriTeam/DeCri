import React, { useContext, useState, useEffect } from "react";
import Web3Context from "./Web3context";

function Dons() {
  const web3Context = useContext(Web3Context);
  const {
    web3,
    account,
    acro_contract,
    database_contract,
    lagoon_contract
  } = web3Context;

  const [contract_acro_balance, setContractAcroBalance] = useState("");
  const [user_acro_balance, setUserAcroBalance] = useState("");
  const [contract_ether_balance, setContractEtherBalance] = useState("");
  const [user_ether_balance, setUserEtherBalance] = useState("");

  async function refresh_contract_variables() {
     setContractEtherBalance(await acro_contract.methods.get_ether_balance_of_this_contract().call());
     setContractAcroBalance(await acro_contract.methods.get_acro_balance_of_this_contract().call());
     setUserEtherBalance(await acro_contract.methods.get_ether_balance_of_sender().call({ from: account }));
     setUserAcroBalance(await acro_contract.methods.get_acro_balance_of_sender().call({ from: account }));
  };

  useEffect(() => { refresh_contract_variables(); }, []);
	
  async function on_btn_buy_acro_click() {
     try
     {
        await acro_contract.methods.tmp_buy_acro().send({ from: account, value:web3.utils.toWei('0.1', "ether") });
        await refresh_contract_variables();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  async function on_btn_acro_donation_click() {
     try
     {
        await acro_contract.methods.acro_donation(web3.utils.toWei('3','ether')).send({ from: account });
        await refresh_contract_variables();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  return (
      <>
        <h1>Dons</h1>
        <button onClick={on_btn_buy_acro_click}>Buy Acro (0.1 ether for 2 Acros)</button>
        <br />
        <button onClick={on_btn_acro_donation_click}>Donate 3 Acros to Decri</button>
        <br />
        Ether contrat: {  web3.utils.fromWei( contract_ether_balance.toString(), 'ether') }<br />
        Acro contrat: {  web3.utils.fromWei(contract_acro_balance.toString(), 'ether') }<br />
        Ether user: { web3.utils.fromWei(user_ether_balance.toString(), 'ether') }<br />
        Acro user: {  web3.utils.fromWei(user_acro_balance.toString(),'ether') }<br />
      </>
  );
}

export default Dons;
