const { BN, expectEvent, expectRevert, ether } = require('@openzeppelin/test-helpers');
const {expect} = require("chai"); // For 'to.be.bignumber'
const AcroContract = artifacts.require('Acro');
const AcroActorsContract = artifacts.require('AcroActors');
const LagoonContract = artifacts.require('Lagoon');

contract('LagoonContract', function (accounts) {
   const [actor1,user1,user2] = accounts;

   var acro_instance;
   var actors_instance;
   var lagoon_instance;
    
   beforeEach('setup contract for each test case', async () => {
      acro_instance = await AcroContract.new();
      actors_instance = await AcroActorsContract.new(acro_instance.address);
      lagoon_instance = await LagoonContract.new(acro_instance.address, actors_instance.address);
   });

   it("actor1 is a Verified actor", async() => {
      let res = await actors_instance.is_actor(actor1);
      expect(res).to.be.equal(true);
   });

   it("user1 and user2 are not verified actors", async() => {
      let res1 = await actors_instance.is_actor(user1);
      expect(res1).to.be.equal(false);
      let res2 = await actors_instance.is_actor(user2);
      expect(res2).to.be.equal(false);
   });

   it("only actors can create a new real zone", async () => {
      let res1 = lagoon_instance.new_real_zone("http://fake_metadata_file_url/", {from: user1});
      await expectRevert(res1,"Not verified Actor");
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/", {from: actor1});
   });

   it("Real zones are created properly", async () => {
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/", {from: actor1});
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/2", {from: actor1});
      let token_count = await lagoon_instance.get_tokens_count();
      expect(token_count).to.be.bignumber.equal(new BN('2'));
      let uri = await lagoon_instance.uri(2);
      expect(uri).to.be.equal("http://fake_metadata_file_url/2");
   });

   it("only actors can add a state to new real zone", async () => {
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/", {from: actor1});
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/2", {from: actor1});
      let res1 = lagoon_instance.update_real_zone(1,"http://fake_metadata_file_url/3", {from: user1});
      await expectRevert(res1,"Not verified Actor");
      await lagoon_instance.update_real_zone(1,"http://fake_metadata_file_url/3", {from: actor1});
   });

   it("Real zones are properly updated", async () => {
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/", {from: actor1});
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/2", {from: actor1});
      await lagoon_instance.update_real_zone(1,"http://fake_metadata_file_url/3", {from: actor1});
      let uri = await lagoon_instance.uri(1);
      expect(uri).to.be.equal("http://fake_metadata_file_url/3");
   });

   it("Everybody can create a virtual zone", async () => {
      await lagoon_instance.new_virtual_zone({from: user1});
      await lagoon_instance.new_virtual_zone({from: actor1});
   });

   it("It is not possible to add a state to a virtual zone", async () => {
      await lagoon_instance.new_virtual_zone({from: actor1});
      let res1 = lagoon_instance.update_real_zone(1,"http://fake_metadata_file_url/3", {from: actor1});
      await expectRevert(res1,"only applies to real");
   });

   it("Anybody can merge a virtual and a real zone", async () => {
      // Create a new real zone and give it to user1
      await lagoon_instance.new_real_zone("http://fake_metadata_file_url/", {from: actor1});
      await lagoon_instance.safeTransferFrom(actor1,user1,1,1,"0x", {from: actor1});

      await lagoon_instance.new_virtual_zone({from: user1});

      let t1 = await lagoon_instance.balanceOf(user1,1);
      expect(t1).to.be.bignumber.equal(new BN('1'));
      let t2 = await lagoon_instance.balanceOf(user1,2);
      expect(t2).to.be.bignumber.equal(new BN('1'));

      // expect( await lagoon_instance.lagoon_types(1) ).to.be.equal(LagoonContract.LagoonType.REAL.toString()); 
      // expect( await lagoon_instance.lagoon_types(2) ).to.be.equal(LagoonContract.LagoonType.VIRTUAL.toString()); 

      // user1 will need some Acro to pay for merging
      await acro_instance.buy_acro({ from: user1, value:web3.utils.toWei('0.1', "ether") });
      let acro_balance_before_merge = await acro_instance.balanceOf(user1);

      await acro_instance.approve(lagoon_instance.address, web3.utils.toWei('1', 'ether'), { from: user1 });
      await lagoon_instance.merge_tokens(1,2, { from: user1 });

      let acro_balance_after_merge = await acro_instance.balanceOf(user1);

      // expect( await lagoon_instance.lagoon_types(2) ).to.be.equal(LagoonContract.LagoonType.BOTH.toString()); 

      // 1 token left
      t1 = await lagoon_instance.balanceOf(user1,1);
      expect(t1).to.be.bignumber.equal(new BN('0'));
      t2 = await lagoon_instance.balanceOf(user1,2);
      expect(t2).to.be.bignumber.equal(new BN('1'));
   });

   it("It is not possible to add a state to a virtual zone", async () => {
      await lagoon_instance.new_virtual_zone({from: actor1});
      let res1 = lagoon_instance.update_real_zone(1,"http://fake_metadata_file_url/3", {from: actor1});
      await expectRevert(res1,"only applies to real");
   });
});
