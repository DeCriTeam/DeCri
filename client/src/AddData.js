import React, { useContext, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Web3Context from "./Web3context";
import IPFS from "ipfs-api"; // const IPFS = require('ipfs-api');

function AddData() {
  const web3Context = useContext(Web3Context);
  const {
    account,
    lagoon_contract
  } = web3Context;

  const [upload_file_buffer, setUploadFileBuffer] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [ form, setForm ] = useState({})
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  async function on_file_change(event) {
    const file = event.target.files[0]
    if (file) {
      const data = Buffer.from(await new Response(file).arrayBuffer());
      setUploadFileBuffer(data);
    }
  }

  async function on_btn_new_real_zone_click() {
     setDisabled(true);
     try
     {
        const { latitude, longitude, profondeur, etat } = form
        const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

        var url_image = "";
        if (upload_file_buffer!=null)
        {
          var ret_ipfs = await ipfs.add(upload_file_buffer);
          var hash_ipfs = ret_ipfs[0].hash;
          url_image = "https://ipfs.io/ipfs/" + hash_ipfs;
        }

        var metadatas = {
          name: "LAG",
          description: "Lagoon",
          image: url_image,
          properties: {
            latitude: latitude,
            longitude: longitude,
            profondeur: profondeur,
            etat: etat
          }
        };
        var buffer_metadatas = Buffer.from(JSON.stringify(metadatas), 'utf8');
        var ret_ipfs_metadatas = await ipfs.add(buffer_metadatas);
        var hash_ipfs_metadatas = ret_ipfs_metadatas[0].hash;
        var metadatas_ipfs_url = "https://ipfs.io/ipfs/" + hash_ipfs_metadatas;

        await lagoon_contract.methods.new_real_zone(metadatas_ipfs_url).send({ from: account });
        window.location = '/data/all';
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  return (
      <>
        <h2>Déclarer une nouvelle zone</h2>
        <Form>
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
                <Form.Label column sm={2}>Profondeur</Form.Label>
                <Col sm={10}>
                    <Form.Control type="text" disabled={disabled} onChange={ e => setField('profondeur', e.target.value) } />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>Etat</Form.Label>
                <Col sm={10}>
                    <Form.Control as="select" disabled={disabled} onChange={ e => setField('etat', e.target.value) }>
                        <option>OK</option>
                        <option>Bof</option>
                        <option>HS</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>Fichier</Form.Label>
                <Col sm={10}>
                  <Form.File type="file" id="file1" onChange={ on_file_change } disabled={disabled} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button onClick={on_btn_new_real_zone_click} disabled={disabled}>Create</Button>
                </Col>
            </Form.Group>
        </Form>
      </>
  );
}

export default AddData;
