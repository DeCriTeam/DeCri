// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Lagoon is ERC721 {
  struct ItemJeu {
    uint8 x;
    uint8 y;
    uint8 type_item; 
  }

  ItemJeu[] items; // level dépend du nombre d'items

  bool has_zone;
  uint zone_id;
  uint participation_zone;  

  constructor() ERC721("LAGOON", "LAG") {

  }

  // TODO: Redéfinir les mécanismes de transfer pour le prélèvement de frais
}
