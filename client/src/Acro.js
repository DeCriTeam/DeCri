import React, { useContext, useState, useEffect, useCallback } from "react";
import Web3Context from "./Web3context";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function Acro() {
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
  const [user_acro_staking_unlock_date, setUserAcroStakingUnlockDate] = useState("");

  const refresh = useCallback( async (_account, _acro_contract) => {
    setContractEtherBalance(await _acro_contract.methods.get_ether_balance_of_this_contract().call());
    setContractAcroBalance(await _acro_contract.methods.get_acro_balance_of_this_contract().call());
    setUserEtherBalance(await _acro_contract.methods.get_ether_balance_of_sender().call({ from: _account }));
    setUserAcroBalance(await _acro_contract.methods.get_acro_balance_of_sender().call({ from: _account }));
    setUserAcroStakingBalance(await _acro_contract.methods.stakingBalance(_account).call({from: _account}));
    setUserAcroStakingUnlockDate(await _acro_contract.methods.stakingUnlockDate(_account).call({from: _account}));
  },[]);

  useEffect(() => { refresh(account, acro_contract); }, [refresh,account,acro_contract]);

  async function on_btn_buy_acro_click() {
    try
    {
       await acro_contract.methods.buy_acro().send({ from: account, value:web3.utils.toWei('0.1', "ether") });
       await refresh(account, acro_contract);
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
      await refresh(account, acro_contract);
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
      await refresh(account, acro_contract);
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
      await acro_contract.methods.unstakeTokens().send({from: account});
      await refresh(account, acro_contract);
    }
    catch (error)
    {
      alert('Transaction failed');
      /*
      const tx = await web3.eth.getTransaction(error.transactionHash);
      var result = await web3.eth.call(tx, tx.blockNumber)
      result = result.startsWith('0x') ? result : `0x${result}`
      if (result && result.substr(138)) {
         const reason = web3.utils.toAscii(result.substr(138))
         console.log(reason);
      }
      */
    }
  };

  async function on_btn_add_acro_asset_to_metamask_click() {
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: acro_contract._address,
          symbol: 'ACRO',
          decimals: 18,
          image: 'https://decri.herokuapp.com/static/media/ACRO-vf.819c178b.png'
        },
      }
    });
  };

  return (
    <>
      <Table striped bordered hover>
      <tbody>
        <tr>
          <td colSpan="3">
            <Button onClick={on_btn_add_acro_asset_to_metamask_click}>Add ACRO to metamask</Button>
          </td>
        </tr>
        <tr>
           <td>Contract Ether balance:</td>
           <td>{  web3.utils.fromWei(contract_ether_balance.toString(), 'ether') }</td>
           <td></td>
        </tr>
        <tr>
           <td>Contract ACRO balance:</td>
           <td>{  web3.utils.fromWei(contract_acro_balance.toString(), 'ether') }</td>
           <td>
              <Button onClick={on_btn_acro_donation_click}>Donate 3 Acros to Decri</Button>
           </td>
        </tr>
        <tr>
           <td>My Ether balance:</td>
           <td>
              { web3.utils.fromWei(user_ether_balance.toString(), 'ether') }
           </td>
           <td />
        </tr>
        <tr>
           <td>My ACRO balance:</td>
           <td>
              { web3.utils.fromWei(user_acro_balance.toString(),'ether') }
           </td>
           <td>
             <Button onClick={on_btn_buy_acro_click}>Buy Acro (0.1 ether for 2 Acros)</Button>
           </td>
        </tr>
        <tr>
           <td>My ACRO staking balance:</td>
           <td>
             { web3.utils.fromWei(user_acro_staking_balance.toString(), 'ether') }
           </td>
           <td>
             <Button onClick={on_btn_acro_stake}> Stake 2 ACROs</Button>
           </td>
        </tr>
        <tr>
           <td>My ACRO staking unlock date:</td>
           <td>
             { user_acro_staking_unlock_date==='0' ? ("-") : (new Date(user_acro_staking_unlock_date*1000)).toISOString() }
             
           </td>
           <td>
              <Button onClick={on_btn_acro_unstake}>Unstake</Button>
           </td>
        </tr>
      </tbody>
      </Table>
    </>
  );
}

export default Acro;
