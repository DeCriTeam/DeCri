import React, { useContext, useState, useEffect } from "react";
import Web3Context from "./Web3context";

function Dons() {
  const web3Context = useContext(Web3Context);
  const {
    web3,
    account,
    acro_contract
  } = web3Context;

  const [contract_acro, setContractAcro] = useState("");
  const [user_acro, setUserAcro] = useState("");
  const [contract_ether, setContractEther] = useState("");
  const [user_ether, setUserEther] = useState("");

  // refresh_contract_variables = async () => {
  async function refresh_contract_variables() {
     setContractEther(await acro_contract.methods.get_ether_balance_of_this_contract().call());
     setContractAcro(await acro_contract.methods.get_acro_balance_of_this_contract().call());
     setUserEther(await acro_contract.methods.get_ether_balance_of_sender().call({ from: account }));
     setUserAcro(await acro_contract.methods.get_acro_balance_of_sender().call({ from: account }));
     // await web3.eth.getBalance(account),
     // await acro_contract.methods.balanceOf(account).call()
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

  async function on_btn_test_signature_click() {
     try
     {
        var signature = await web3.eth.personal.sign("Hello !", account);
        alert(signature);
        console.log(signature);

        // Verification de la signature:
        const signer = await web3.eth.personal.ecRecover("Hello !", signature);
        console.log(signer);

        const signer2 = await web3.eth.accounts.recover("Hello !", signature);
        console.log(signer2);
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
        <button onClick={on_btn_test_signature_click}>Test signature</button>
        <br />
        Ether contrat: {  web3.utils.fromWei( contract_ether.toString(), 'ether') }<br />
        Acro contrat: {  web3.utils.fromWei(contract_acro.toString(), 'ether') }<br />
        Ether user: { web3.utils.fromWei(user_ether.toString(), 'ether') }<br />
        Acro user: {  web3.utils.fromWei(user_acro.toString(),'ether') }<br />
        <br />
        User Address: { account }<br />
      </>
  );
}

export default Dons;
