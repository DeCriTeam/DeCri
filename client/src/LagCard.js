import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'

function LagCard(props) {
  let item = props.item;

  async function on_btn_transfer_click() {
    props.onTransfer(item);
  }

  return (
    <Card style={{ width: '18rem' }}>
      { (item.lagoon_type==='1') ? ( 
         <Card.Img variant="top" src={item.image} width="100" height="180" />
      ) : ("") }
      <Card.Body>
        { (item.lagoon_type==='1') ? ( 
          <>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
          </>
        ) : (
          <Card.Title>Game</Card.Title>
        ) }
        <div>
          { (item.lagoon_type==='1') ? ( 
            <a href={item.url_json} target="_blank" rel="noopener noreferrer">Metadatas</a>
          ) : (
            <Link to={`/play/${item.token_id}`}>Play</Link>
          ) }
        </div>
        <div>Balance: {item.my_balance}</div>
        { (item.my_balance>0) ? ( <Button variant="primary" onClick={on_btn_transfer_click}>Transfer</Button> ) : ("") }
      </Card.Body>
    </Card>
  );
}

export default LagCard;
