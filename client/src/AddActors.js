import React, { useContext, useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Web3Context from "./Web3context";

function AddActors() {
    const web3Context = useContext(Web3Context);
    const {
      account,
      actors_contract,
    } = web3Context;
    
    const [disabled, setDisabled] = useState(false);
    const [ form, setForm ] = useState({})
    const setField = (field, value) => {
      setForm({
        ...form,
        [field]: value
      })
    }
    
    async function on_btn_new_actor_click() {
       setDisabled(true);
       try
       {
          const { name, country, email, latitude, longitude, yearofcreation, actortype, dateD } = form;
          console.log(actortype);
          await actors_contract.methods.add_new_actor(account, {
             actorName: name,
             country: country,
             latCenter: latitude,
             longCenter: longitude,
             yearOfCreation: yearofcreation,
             email: email,
             actorType: actortype,
             dateOfRegistration: dateD,
		 vote_score: 0,
		  isRegistered: true,
		  isValidated: false
          }).send({from: account});
          
          window.location = '/actors';
       }
       catch (error)
       {
           alert('Transaction failed.');
           console.error(error);
       }
    };
  
    return (
        <>
          <h2>Register a new actor</h2>
          <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Name</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('name', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Country</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('country', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>email</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('email', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Latitude</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('latitude', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Longitude</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('longitude', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Year of creation</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('yearofcreation', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Todaysdate</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" disabled={disabled} onChange={ e => setField('dateD', e.target.value) } />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Type</Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" disabled={disabled} onChange={ e => setField('actortype', e.target.value) }>
                                <option value="0">NGO</option>
                                <option value="1">Diving Club</option>
                                <option value="2">Researcher</option>
                            </Form.Control>
                        </Col>
                </Form.Group>
                
                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button onClick={on_btn_new_actor_click} disabled={disabled}>Register</Button>
                    </Col>
                </Form.Group>
        </Form>

        </>
        );
      }

export default AddActors;
