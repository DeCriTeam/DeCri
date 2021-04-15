import React, { useContext, useState, useEffect } from "react";
import Web3Context from "./Web3context";
import accrologo from "./ACRO-vf.png";

function Dons() {
  const web3Context = useContext(Web3Context);
  const {
    web3,
    account,
    acro_contract,
  } = web3Context;

  const [contract_acro_balance, setContractAcroBalance] = useState("");
  const [user_acro_balance, setUserAcroBalance] = useState("");
  const [contract_ether_balance, setContractEtherBalance] = useState("");
  const [user_ether_balance, setUserEtherBalance] = useState("");
  const [user_acro_staking_balance, setUserAcroStakingBalance] = useState("");

  async function refresh() {
     setContractEtherBalance(await acro_contract.methods.get_ether_balance_of_this_contract().call());
     setContractAcroBalance(await acro_contract.methods.get_acro_balance_of_this_contract().call());
     setUserEtherBalance(await acro_contract.methods.get_ether_balance_of_sender().call({ from: account }));
     setUserAcroBalance(await acro_contract.methods.get_acro_balance_of_sender().call({ from: account }));
     setUserAcroStakingBalance(await acro_contract.methods.stakingBalance(account).call({from: account}));
  };

  useEffect(() => { refresh(); }, []);
	
  async function on_btn_buy_acro_click() {
     try
     {
        await acro_contract.methods.buy_acro().send({ from: account, value:web3.utils.toWei('0.1', "ether") });
        await refresh();
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
        await refresh();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  async function on_btn_acro_stake() {
     try
     {
      
      await acro_contract.methods.stakeAcroTokens(web3.utils.toWei('2','ether')).send( {from: account});
     
      await refresh();
     }
     catch (error)
     {
        alert('Transaction failed');
        console.error(error);
     }
  };

  async function on_btn_acro_unstake() {
      try
      {
      await acro_contract.methods.unstakeTokens({from: account});
      await refresh();
      }
      catch (error)
      {
         alert('Transaction failed');
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
        Ether contrat: {  web3.utils.fromWei(contract_ether_balance.toString(), 'ether') }<br />
        Acro contrat: {  web3.utils.fromWei(contract_acro_balance.toString(), 'ether') }<br />
        Ether user: { web3.utils.fromWei(user_ether_balance.toString(), 'ether') }<br />
        Acro user: {  web3.utils.fromWei(user_acro_balance.toString(),'ether') }<br />

        <h1> Stake your Acro </h1><img src= {accrologo} height="54" alt="" /> <br />
        Staking balance: {  web3.utils.fromWei(user_acro_staking_balance.toString(), 'ether') }<br />
                
        <button onClick={on_btn_acro_stake}> Stake 2 acro ! </button><br />
        <br />
        <button onClick={on_btn_acro_unstake}> Unstake...</button>


      </>
  );
}


        


export default Dons;
