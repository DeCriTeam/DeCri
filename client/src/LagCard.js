import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'

function LagCard(item) {
  item = item.item;
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={item.image} width="100" height="180" />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Button variant="primary">Transférer</Button>
        <div>
          Lagoon type: {item.lagoon_type}
        </div>
        <div>
          My balance: {item.my_balance}
        </div>
        <div>
          <a href={item.url_json} target="_blank" rel="noopener noreferrer">Metadatas</a>
        </div>
        <div>
          <Link to={`/play/${item.token_id}`}>Jouer</Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default LagCard;
