import React, { useContext, useState, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Web3Context from "./Web3context";
import { useParams } from "react-router-dom";

    // TODO: A deplacer ailleurs
    var largeur_case= 70;
    var hauteur_case= 35;
    var offset_x = 10;
    var offset_y = 300;

function Play() {
  const { token_id } = useParams();
  const canvasRef = useRef(null);
  const web3Context = useContext(Web3Context);
  const {
    acro_contract,
    lagoon_contract,
    account
  } = web3Context;

  const [modal_show, setModalShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [ form, setForm ] = useState({})
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  const [level, setLevel] = useState(0);
  const [lagoon_type, setLagoonType] = useState(null);
  const [x_sel, setXSel] = useState(0);
  const [y_sel, setYSel] = useState(0);
  const [game_data, setGameData] = useState("");

  async function refresh() {
     try {
          setLevel(await lagoon_contract.methods.get_game_level(token_id).call({ from: account }));
          setGameData(await lagoon_contract.methods.get_game_datas(token_id).call({ from: account }));
          setLagoonType(await lagoon_contract.methods.lagoon_types(token_id).call());
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };

  async function on_canvas_mousemove(e) {
    var rect = canvasRef.current.getBoundingClientRect();
    var x = e.clientX - rect.left - offset_x - largeur_case/2;
    var y = e.clientY - rect.top - offset_y - hauteur_case/2;

    setXSel( Math.round(x / largeur_case - y / hauteur_case) );
    setYSel( Math.round(x / largeur_case + y / hauteur_case) );
  };

  async function on_canvas_click() {
    await acro_contract.methods.approve(lagoon_contract._address, '100000000000000000').send({ from: account });
    await lagoon_contract.methods.buy_and_put_game_item(token_id, {item_type:1, x: x_sel, y:y_sel}).send({ from: account });
    await refresh();
  }

  async function on_btn_merge_click() {
     setDisabled(false);
     setModalShow(true);
  }

  async function on_popup_btn_cancel_click() {
     setModalShow(false);
  };

  async function on_popup_btn_merge_click() {
     setDisabled(true);
     try
     {
        const { merge_token_id } = form;
        await acro_contract.methods.approve(lagoon_contract._address, '100000000000000000').send({ from: account });
        await lagoon_contract.methods.merge_tokens(merge_token_id, token_id).send({from:account});
        setModalShow(false);
        await refresh();
     }
     catch (error)
     {
         alert('Transaction failed.');
         console.error(error);
     }
  };


  useEffect(() => {
    refresh();
    const context  = canvasRef.current.getContext('2d');

    var nb_cases_largeur = 11;
    var nb_cases_hauteur = 11;

    var images = [];
    images[0] = new Image();
    images[0].src = '/corail-rouge-9.png';
    images[1] = new Image();
    images[1].src = '/corail-jaune-33.png';
    images[0].onload = function() { draw_game(); }
    images[1].onload = function() { draw_game(); }

    function draw_game() {
       for (var x=nb_cases_largeur-1 ; x>=0 ; x--) {
         for (var y=0; y <nb_cases_hauteur; y++) {
            var contour = (x===x_sel && y===y_sel)?'red':'grey';
            dessine_case(x, y, game_data[x + 11 * y], contour);
         }
       }
    }

    function dessine_case(Xi, Yi, idx_image, color_contour) {
      var offX = Xi * largeur_case / 2 + Yi * largeur_case / 2 + offset_x;
      var offY = Yi * hauteur_case / 2 - Xi * hauteur_case / 2 + offset_y;

      context.fillStyle = 'blue';
      context.strokeStyle = color_contour;

      if (color_contour==='red') {
         context.lineWidth = 5;
      } else {
         context.lineWidth = 1;
      }

      context.beginPath();
      context.moveTo(offX, offY + hauteur_case / 2);
      context.lineTo(offX + largeur_case / 2, offY);
      context.lineTo(offX + largeur_case / 2, offY);
      context.lineTo(offX + largeur_case, offY + hauteur_case / 2);
      context.lineTo(offX + largeur_case, offY + hauteur_case / 2);
      context.lineTo(offX + largeur_case / 2, offY + hauteur_case);
      context.lineTo(offX + largeur_case / 2, offY + hauteur_case);
      context.lineTo(offX, offY + hauteur_case / 2);
      context.closePath();
      context.fill();
      context.stroke();

      if (idx_image>0 && idx_image<images.length)
      {
        context.drawImage(images[idx_image-1], offX+24-12, offY-10+5+1,60,40);
      }
    }
  });

  return (
      <>
        <Modal show={modal_show}>
          <Modal.Header>
            <Modal.Title>Merge token</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group>
              <Form.Label>Real token id to merge with:</Form.Label>
              <Form.Control disabled={disabled} type="text" onChange={ e => setField('merge_token_id', e.target.value) } />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
	    { disabled ? (<Spinner animation="border" role="status" />) : ("") }
            <Button variant="secondary" disabled={disabled} onClick={on_popup_btn_cancel_click}>Cancel</Button>
            <Button variant="primary" disabled={disabled} onClick={on_popup_btn_merge_click}>Merge</Button>
          </Modal.Footer>
        </Modal>

        <h1>Jeu { token_id } - Level: {level} </h1>
        <canvas ref={canvasRef} onMouseMove={on_canvas_mousemove} onClick={on_canvas_click} width="800" height="600" style={{ backgroundColor: 'black' }}/>
        { (level>=4 && lagoon_type==='0') ? (
        <div><Button onClick={on_btn_merge_click}>Merge with a real Token</Button></div>
        ) : ("") }
      </>
  );
}

export default Play;
