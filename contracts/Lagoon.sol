// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Acro.sol";
import "./AcroActors.sol";

contract Lagoon is ERC1155 {
   struct GameItem {
      uint8 x;
      uint8 y;
      uint8 item_type;
   }

   enum LagoonType { VIRTUAL, REAL, BOTH }

   Acro acro_contract;
   AcroActors actors_contract;

   using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;

   mapping (uint256 => LagoonType) public lagoon_types;
   mapping (uint256 => uint256) public linked_real_token_id;
   mapping (uint256 => string) private _tokenURIs;
   mapping (uint256 => GameItem[]) public game_items;

   modifier onlyActor() {
     require (actors_contract.is_actor(msg.sender)==true,"Not verified Actor");
     _;
   }

   modifier tokenExists(uint token_id) {
     require(token_id<=_tokenIds.current(),"Token does not exist");
     _;
   }

   constructor(address acro_contract_address, address actors_contract_address) ERC1155("") {
     acro_contract = Acro(acro_contract_address);
     actors_contract = AcroActors(actors_contract_address);
   } 

   function uri(uint256 token_id) public view virtual override returns (string memory) {
      return _tokenURIs[token_id];
   }

   function new_real_zone(string memory metadatas_url) external onlyActor {
      _tokenIds.increment();
      _mint( msg.sender, _tokenIds.current(), 100, "");
      _tokenURIs[_tokenIds.current()] = metadatas_url;
      lagoon_types[_tokenIds.current()] = LagoonType.REAL;
   }

   function update_real_zone(uint token_id, string memory metadatas_url) external onlyActor tokenExists(token_id) {
      require(lagoon_types[token_id]==LagoonType.REAL,"only applies to real");
      _tokenURIs[token_id] = metadatas_url;
   }

   function new_virtual_zone() external returns (uint) {
      _tokenIds.increment();
      _mint(msg.sender, _tokenIds.current(), 1, "");
      lagoon_types[_tokenIds.current()] = LagoonType.VIRTUAL;
      return _tokenIds.current();
   }

   function merge_tokens(uint real_token_id, uint virtual_token_id) external tokenExists(real_token_id) tokenExists(virtual_token_id) {
      // TODO: Paiement en Acro
      require(lagoon_types[real_token_id]==LagoonType.REAL, "Not real lagoon");
      // require(balanceOf(msg.sender, real_token_id)>0 ,"No free real left");	// Test already done in _burn
      require(lagoon_types[virtual_token_id]==LagoonType.VIRTUAL, "Not virtual lagoon");

      _burn(msg.sender, real_token_id, 1);
      lagoon_types[virtual_token_id] = LagoonType.BOTH;
      linked_real_token_id[virtual_token_id] = real_token_id; 
   }

   function get_tokens_count() external view returns (uint) {
      return _tokenIds.current();
   }

   function buy_and_put_game_item(uint token_id, uint8 x, uint8 y,uint8 item_type) external tokenExists(token_id) {
     require(balanceOf(msg.sender, token_id)>0, "This is not your token");
     acro_contract.transferFrom(msg.sender, address(acro_contract),100000000000000000);
     // require(x<11 && y<11 && item_type<3,"Invalid x,y or item_type);
     for (uint i=0;i<game_items[token_id].length;i++) {
        if (game_items[token_id][i].x==x && game_items[token_id][i].y==y) {
           revert("Free slot required");
        }
     }
     game_items[token_id].push(GameItem(x,y,item_type));
   }

   function get_game_level(uint token_id) external view tokenExists(token_id) returns (uint) {
     require(lagoon_types[token_id]!=LagoonType.REAL,"only applies to virtual/both");
      return game_items[token_id].length;
   }

   function get_game_datas(uint token_id) external view tokenExists(token_id) returns (string memory) {
     require(lagoon_types[token_id]!=LagoonType.REAL,"only applies to virtual/both");
     bytes memory ret = new bytes(11*11);
     for (uint i=0;i<11*11;i++) {
        ret[i] = '0';
     }
     for (uint i=0;i<game_items[token_id].length;i++) {
        require( game_items[token_id][i].x<11 && game_items[token_id][i].y<11 ,"Internal error");
        if (game_items[token_id][i].item_type==1) {
          ret[game_items[token_id][i].x + game_items[token_id][i].y*11] = '1';
        } else if (game_items[token_id][i].item_type==2) {
          ret[game_items[token_id][i].x + game_items[token_id][i].y*11] = '2';
        } 
     }
     return string(ret);
   }
}
