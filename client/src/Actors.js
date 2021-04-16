import React, { useContext, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Web3Context from "./Web3context";

function Actors() {
    const web3Context = useContext(Web3Context);
    const {
      account,
      actors_contract,
    } = web3Context;
  
    const [actorsinfos, setActorsInfos] = useState([]);

    async function refresh() {
      let count = await actors_contract.methods.get_actors_count().call();
      let actors = [];
      for (var i=0;i<count;i++) {
        let addr_actor = await actors_contract.methods.actors(i).call();
        let actor = await actors_contract.methods.RegisteredActors(addr_actor).call();
        actors.push(actor);
      }
      setActorsInfos(actors);
      console.log(actors);
    }

    useEffect(() => { refresh(); }, []);
  
    return (
        <>
        <h2> List of actors </h2>
        <a href="/actors/add">Register new actor</a>

        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
        {actorsinfos !== null && 
            actorsinfos.map((item, index) => (
              <tr key={index}>
                <td>{item.actorName}</td>
                <td>{item.email}</td>
              </tr>
            ))
          }
        </tbody>
        </Table>
        </>
        );
      }

export default Actors;
