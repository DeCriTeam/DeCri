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

   /**
    * @title onlyActor
    * @notice This modifier checks if the sender is a verified actor in actor's smartcontract
    */
   modifier onlyActor() {
     require (actors_contract.is_actor(msg.sender)==true,"Not verified Actor");
     _;
   }

   /**
    * @title tokenExists
    * @notice This modifier checks is a token exists in this ERC1155
    * @param token_id Token ID
    */
   modifier tokenExists(uint token_id) {
     require(token_id<=_tokenIds.current(),"Token does not exist");
     _;
   }
   
   /**
    * @title isMyToken
    * @notice This modifier checks if the sender owns a token
    * @param token_id Token ID
    */
   modifier isMyToken(uint token_id) {
     require(balanceOf(msg.sender, token_id)>0, "This is not your token");
   }

   /**
    * @title constructor
    * @notice Acro and Actors contract's addresses are set on this contract during deployment
    * @param acro_contract_address Acro contract address
    * @param actors_contract_address Actors contract address
    */
   constructor(address acro_contract_address, address actors_contract_address) ERC1155("") {
     acro_contract = Acro(acro_contract_address);
     actors_contract = AcroActors(actors_contract_address);
   } 

   /**
    * @title uri
    * @notice get json metadata file urls
    * @param token_id Token ID
    * @return string url
    */
   function uri(uint256 token_id) 
      public
      view
      virtual
      override
      returns (string memory) 
   {
      return _tokenURIs[token_id];
   }

   /**
    * @title new_real_zone
    * @notice Declare a new physical coral zone in the database
    * this declaration is allowed for verified actors only
    * @param metadatas_url json metadata file url
    */
   function new_real_zone(string memory metadatas_url) 
      external
      onlyActor
   {
      _tokenIds.increment();
      _mint( msg.sender, _tokenIds.current(), 100, "");
      _tokenURIs[_tokenIds.current()] = metadatas_url;
      lagoon_types[_tokenIds.current()] = LagoonType.REAL;
   }

   /**
    * @title update_real_zone
    * @notice Declare a new state for an existing physical coral zone in the database
    * This declaration is allowed for verified actors only
    * Every actor is allowed to update informations about any coral aone
    * @param token_id Token ID
    * @param metadatas_url json metadata file url
    */
   function update_real_zone(uint token_id, string memory metadatas_url)
     external 
     onlyActor 
     tokenExists(token_id) 
   {
      require(lagoon_types[token_id]==LagoonType.REAL,"only applies to real");
      _tokenURIs[token_id] = metadatas_url;
   }

   /**
    * @title new_virtual_zone
    * @notice Create a new game party (virtual zone)
    * Everybody can create a new virtual zone
    */
   function new_virtual_zone() 
      external
      returns (uint) 
   {
      _tokenIds.increment();
      _mint(msg.sender, _tokenIds.current(), 1, "");
      lagoon_types[_tokenIds.current()] = LagoonType.VIRTUAL;
      return _tokenIds.current();
   }

   /**
    * @title merge_token
    * @notice Any user can merge one of his real token with one of his virtual zone
    * Virtual token is linked to real token and change type to "BOTH" token
    * The real token is destroyed for this user
    * But this real token is kept in the database
    * @param real_token_id Real token ID
    * @param virtual_token_id Virtual token ID
    */
   function merge_tokens(uint real_token_id, uint virtual_token_id) 
      external 
      tokenExists(real_token_id) 
      tokenExists(virtual_token_id) 
      // isMyToken(real_token_id)   <- This test is done in _burn
      isMyToken(virtual_token_id)
   {
      require(lagoon_types[real_token_id]==LagoonType.REAL, "Not real lagoon");
      require(lagoon_types[virtual_token_id]==LagoonType.VIRTUAL, "Not virtual lagoon");

      pay_acro(100000000000000000);
      _burn(msg.sender, real_token_id, 1);    // Destruct real token for the user. (Balance can be 0, information about this real token is kept in the database)

      lagoon_types[virtual_token_id] = LagoonType.BOTH;        // Link virtual token with real
      linked_real_token_id[virtual_token_id] = real_token_id; 
   }

   /**
    * @title get_tokens_count
    * @notice Get total tokens count (for UI)
    * @return uint token count
    */
   function get_tokens_count()
      external
      view
      returns (uint) 
   {
      return _tokenIds.current();
   }

   /**
    * @title  pay_acro
    * @notice Force user to pay an amount of Acro ERC20 token
    * user should first call approve on Acro ERC20 contract before
    * @param amount of Acro to be paid by user
    */
   function pay_acro(uint amount)
      private
   {
      acro_contract.transferFrom(msg.sender, address(acro_contract),amount);
   }

   /**
    * @title buy_and_put_game_item
    * @notice Buy and add item for our game and put it on a virtual zone
    * @param token_id Token ID which represents our virtual zone
    * @param x X position where to put the item on our virtual zone
    * @param y Y position where to put the item on our virtual zone
    * @param item_type Item type
    */
   function buy_and_put_game_item(uint token_id, uint8 x, uint8 y,uint8 item_type) 
     external
     tokenExists(token_id) 
     isMyToken(token_id)
   {
     require(x<11 && y<11 && item_type<3,"Invalid x,y or item_type");
     pay_acro(100000000000000000);
     for (uint i=0;i<game_items[token_id].length;i++) {
        if (game_items[token_id][i].x==x && game_items[token_id][i].y==y) {
           revert("Free slot required");
        }
     }
     game_items[token_id].push(GameItem(x,y,item_type));
   }

   /**
    * @title get_game_level
    * @notice Level increase for a virtual zone when a user adds items on it
    * this function gets the level for a given virtual zone
    * @param token_id Token ID which represents the virtual zone
    * @return level of the virtual zone
    */
   function get_game_level(uint token_id) external
      view
      tokenExists(token_id)
      returns (uint) 
   {
      require(lagoon_types[token_id]!=LagoonType.REAL,"only applies to virtual/both");
      return game_items[token_id].length;
   }

   /**
    * @title get_game_datas
    * @notice gets serialized datas for a given virtual zone (item mapping)
    * @param token_id Token ID which represents the virtual zone
    * @return serialized data of the virtual zone
    */
   function get_game_datas(uint token_id)
      external
      view
      tokenExists(token_id)
      returns (string memory) 
   {
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
