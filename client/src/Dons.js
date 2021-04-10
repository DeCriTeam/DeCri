import React, { /* useContext,*/ Component } from "react";

import AcroContract from "./contracts/Acro.json";
import getWeb3 from "./getWeb3";
// import Web3Context from "./Web3context";

class Dons extends Component {

  // TODO: Redondance de code
  state = { 
    web3:null,
    account:null,
    acro_contract:null,
    acro_balance_contract:0,
    ether_balance_contract:0,
    acro_balance_user:0,
    ether_balance_user:0,
  };

  componentDidMount = async () => {
     try 
     {
       const web3 = await getWeb3();
       const accounts = await web3.eth.getAccounts();

       const networkId = await web3.eth.net.getId();
       const deployedNetwork = AcroContract.networks[networkId];

       window.ethereum.on("accountsChanged", this.on_account_changed);

       this.setState({ 
         web3,
         account: accounts[0],
         acro_contract: new web3.eth.Contract(AcroContract.abi, deployedNetwork && deployedNetwork.address) 
       }, this.refresh_contract_variables );
     }
     catch (error)
     {
       alert(`Failed to load web3, accounts, or contract. Check console for details.`);
       console.error(error);
     }
  };

  on_account_changed = async () => {
    var accounts = await window.ethereum.enable();
    this.setState({ account: accounts[0] }, this.refresh_contract_variables);
  };

  refresh_contract_variables = async () => {
     this.setState({
         ether_balance_contract: await this.state.acro_contract.methods.get_ether_balance_of_this_contract().call(),
         acro_balance_contract: await this.state.acro_contract.methods.get_acro_balance_of_this_contract().call(),
         ether_balance_user: await this.state.acro_contract.methods.get_ether_balance_of_sender().call({ from: this.state.account }),
         acro_balance_user:  await this.state.acro_contract.methods.get_acro_balance_of_sender().call({ from: this.state.account }),
         // ether_balance_user: await this.state.web3.eth.getBalance(this.state.account),
         // acro_balance_user: await this.state.acro_contract.methods.balanceOf(this.state.account).call()
    });
  };

  on_btn_buy_acro_click = async () => {
     const { web3, account, acro_contract } = this.state;
     try
     {
        await acro_contract.methods.tmp_buy_acro().send({ from: account, value:web3.utils.toWei('0.1', "ether") });
        await this.refresh_contract_variables();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  on_btn_acro_donation_click = async () => {
     const { web3, account, acro_contract } = this.state;
     try
     {
        await acro_contract.methods.acro_donation(web3.utils.toWei('3','ether')).send({ from: account });
        await this.refresh_contract_variables();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  on_btn_test_signature_click = async () => {
     const { web3, account, acro_contract } = this.state;
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

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <>
        <h1>Dons</h1>

        <button onClick={this.on_btn_buy_acro_click}>Buy Acro (0.1 ether for 2 Acros)</button>
        <br />
        <button onClick={this.on_btn_acro_donation_click}>Donate 3 Acros to Decri</button>
        <br />
        <button onClick={this.on_btn_test_signature_click}>Test signature</button>
        <br />
	User Address: { this.state.account }<br />

        Ether contrat: {  this.state.web3.utils.fromWei( this.state.ether_balance_contract.toString(), 'ether') }<br />
        Acro contrat: {  this.state.web3.utils.fromWei(this.state.acro_balance_contract.toString(), 'ether') }<br />
        Ether user: { this.state.web3.utils.fromWei(this.state.ether_balance_user.toString(), 'ether') }<br />
        Acro user: {  this.state.web3.utils.fromWei(this.state.acro_balance_user.toString(),'ether') }<br />


      </>
    );
  }
}

export default Dons;
