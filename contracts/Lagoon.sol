// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Lagoon is ERC721 {
  bool has_zone_reelle;
  uint zone_reelle_id;

  bool has_zone_virtuelle_jeu;
  uint zone_virtuelle_jeu_id;

  constructor() ERC721("LAGOON", "LAG") {

  }

  // TODO: Redéfinir les mécanismes de transfer pour le prélèvement de frais
}
