// actors.test.js
const { BN, expectEvent, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroActors = artifacts.require('AcroActors');

contract('AcroActors', function (accounts) {
    const [user1,user2,user3,user4] = accounts;
    console.log(user1,user2,user3,user4);

});
