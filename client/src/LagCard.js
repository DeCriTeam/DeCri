import React from "react";
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'

function LagCard(props) {
  let item = props.item;

  async function on_btn_transfer_click() {
    props.onTransfer(item);
  }

  return (
   <div class="col-auto mb-4">
    <Card style={{ width: '18rem' }}>
      <Card.Header>
              #{item.token_id} { item.lagoon_type==='2' ? ("Merged LAG") : (item.lagoon_type==='0' ? "Game" : (item.name)) }
              <div class="float-right">
                <Badge variant="danger">{item.my_balance}</Badge>
              </div>
      </Card.Header>
      { (item.lagoon_type==='1' || item.lagoon_type==='2') ? ( 
         <Card.Img variant="top" src={item.image} width="100" height="180" />
      ) : ("") }
      <Card.Body>
        { (item.lagoon_type==='1' || item.lagoon_type==='2') ? ( 
          <>
            <Card.Text>{item.description}</Card.Text>
          </>
        ) : (
          <Card.Title>#{item.token_id} Game</Card.Title>
        ) }
        <ButtonGroup>
          { (item.lagoon_type==='1' || item.lagoon_type==='2') ? ( 
            <a href={item.url_json} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Datas</a>
          ) : ("") }
          { (item.lagoon_type==='0' || item.lagoon_type==='2') ? ( 
            <Link to={`/play/${item.token_id}`} className="btn btn-info">Play</Link>
          ) : ("") }
        { (item.my_balance>0) ? ( <Button variant="warning" onClick={on_btn_transfer_click}>Transfer</Button> ) : ("") }
        </ButtonGroup>
      </Card.Body>
    </Card>
   </div>
  );
}

export default LagCard;
