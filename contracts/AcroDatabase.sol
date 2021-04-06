// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcroDatabase is AcroActors {

   // Regroupement des "100" tokens associés à une même zone
   uint cpt_lagoon_id;

   function new_real_zone(/* infos sur la zone */) public {	// Argument: voir si il est possible de passer une structure
      require(actors_whitelist[msg.sender]==true);

      // minter "100" lagoons

      lagoon_id++;
   }

   function update_real_zone_state(/* infos sur la zone */) public {
      require(actors_whitelist[msg.sender]==true);
   }
}

