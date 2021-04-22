import React, { useContext, useState, useEffect,useCallback } from "react";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import Web3Context from "./Web3context";

function Actors() {
    const web3Context = useContext(Web3Context);
    const {
      actors_contract,
      account,
      is_actor,
    } = web3Context;
  
    const [actorsinfos, setActorsInfos] = useState([]);

    const refresh = useCallback( async (_actors_contract) => {
      let count = await _actors_contract.methods.get_actors_count().call();
      let actors = [];
      for (var i=0;i<count;i++) {
        let addr_actor = await _actors_contract.methods.actors(i).call();
        let actor = await _actors_contract.methods.RegisteredActors(addr_actor).call();
        actor.address = addr_actor;
        actors.push(actor);
      }
      setActorsInfos(actors);
    },[]);

    async function on_btn_vote_click(addr) {
      try
      {
        await actors_contract.methods.votingForActor(addr).send({ from: account });
        await refresh(actors_contract);
      }
      catch (error)
      {
         alert('Transaction failed.');
         console.error(error);
      }
    };

    useEffect(() => { refresh(actors_contract); }, [refresh,actors_contract]);
  
    return (
        <>
        <h2> List of actors </h2>
        <Link to="/actors/add">Register new actor</Link>

        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ethereum address</th>
            <th>Name</th>
            <th>Email</th>
            <th>Vote score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {actorsinfos !== null && 
            actorsinfos.map((item, index) => (
              <tr key={index}>
                <td>{item.address}</td>
                <td>{item.actorName}</td>
                <td>{item.email}</td>
                <td>{ item.isValidated===true ? (<Badge variant="success">Validated</Badge>) : (item.vote_score) }</td>
                <td>{ is_actor && item.isValidated===false ? (<Button onClick={ () => on_btn_vote_click(item.address) } >Vote</Button>) : ("") }</td>
              </tr>
            ))
          }
        </tbody>
        </Table>
        </>
        );
      }

export default Actors;
