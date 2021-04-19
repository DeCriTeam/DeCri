import React, { useCallback, useContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import CardDeck from "react-bootstrap/CardDeck";
import Web3Context from "./Web3context";
import LagCard from "./LagCard";
import { Link, Redirect, useParams } from "react-router-dom";

function Data() {
  const { plags } = useParams();
  const web3Context = useContext(Web3Context);
  const {
    lagoon_contract,
    account
  } = web3Context;

  const [loading, setLoading] = useState(true);

  const [modal_show, setModalShow] = useState(false);
  const [modal_destination_wallet, setModalDestinationWallet] = useState(null);
  const [modal_selected_lag, setModalSelectedLag] = useState(null);

  const [redirect, setRedirect] = useState(null);
  const [real_items, setRealItems] = useState([]);
  const [virtual_items, setVirtualItems] = useState([]);

  const refresh = useCallback( async (_account, _lagoon_contract, _plags) => {
     try {
       var token_count = await _lagoon_contract.methods.get_tokens_count().call();
       var _virtual_items = [];
       var _real_items = [];
       for (var i=0;i<token_count;i++) {
         var url_json = await _lagoon_contract.methods.uri(i+1).call();
         var json_item = {}
         if (url_json!=='') {
            let response = await fetch(url_json);
            json_item = await response.json();
         }

         json_item.url_json = url_json;
         json_item.token_id = (i+1)
         json_item.lagoon_type = await _lagoon_contract.methods.lagoon_types(i+1).call();
         json_item.my_balance = await _lagoon_contract.methods.balanceOf(_account, i+1).call();

         if (_plags==='me' && json_item.my_balance==='0') {
	 } else {
           if (json_item.lagoon_type==='0') {
              _virtual_items.push(json_item);
           } else {
              _real_items.push(json_item);
           }
           // TODO: Both items
         }
       }

       setVirtualItems(_virtual_items);
       setRealItems(_real_items);
       setLoading(false);
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  },[]);

  useEffect(() => { refresh(account, lagoon_contract,plags); }, [refresh,account,lagoon_contract,plags]);

  async function on_btn_transfer_click(item) {
     setModalSelectedLag(item);
     setModalShow(true);
  };

  async function on_popup_btn_cancel_click() {
     setModalShow(false);
  };

  async function on_popup_btn_transfer_click() {
     console.log(modal_destination_wallet);
	  console.log(modal_selected_lag);
     setModalShow(false);
  };

  async function on_btn_new_game_click() {
     try
     {
        var token_id = await lagoon_contract.methods.new_virtual_zone().send({ from: account });
        token_id = await lagoon_contract.methods.get_tokens_count().call();    // TODO: Dirty way to get token_id
        setRedirect(`/play/${token_id}`);
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  // TODO: Agencement des cartes ci dessous (à la ligne)
  return (
      <>
         <Modal show={modal_show}>
          <Modal.Header>
            <Modal.Title>Transfer { modal_selected_lag!=null ? modal_selected_lag.token_id : "" }</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group>
              <Form.Label>Destination wallet (Ethereum public address)</Form.Label>
              <Form.Control type="text" onChange={ e => setModalDestinationWallet(e.target.value) } />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={on_popup_btn_cancel_click}>Cancel</Button>
            <Button variant="primary" onClick={on_popup_btn_transfer_click}>Transfer</Button>
          </Modal.Footer>
        </Modal>
        {loading ? (
          <div align="center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>
            { (plags==='me') ? ( 
              <>
                <h2>My LAGSs</h2>
                <Button onClick={on_btn_new_game_click}>Start new game</Button>
                <CardDeck>
                {real_items.map((item, index) => {
                  return (<LagCard onTransfer={ (e) => on_btn_transfer_click(item) } item={item} key={index} />)
                })}
                </CardDeck>
                &nbsp;
                <CardDeck>
                {virtual_items.map((item, index) => {
                  return (<LagCard onTransfer={ (e) => on_btn_transfer_click(item) } item={item} key={index} />)
                })}
                </CardDeck>
              </>
            ) : (
              <>
                <h2>Zones database</h2>
                <Link className="btn btn-primary" to="/add_data">Declare a new zone</Link>
                <CardDeck>
                {real_items.map((item, index) => {
                  return (<LagCard onTransfer={ (e) => on_btn_transfer_click(item) } item={item} key={index} />)
                })}
                </CardDeck>
              </>
            ) }
          </>
        )}
      </>
  );
}

export default Data;
