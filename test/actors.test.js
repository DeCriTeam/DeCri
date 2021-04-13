// actors.test.js
const { BN, expectEvent, expectRevert, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroActors = artifacts.require('AcroActors');
const AcroContract = artifacts.require('Acro');

contract('AcroActors', async accounts => {

    var acroInstance;
    var acroActorsInstance;
    
    const [owner,user1,user2,user3,user4, user5] = accounts;
    
    beforeEach('setup contract for each test case', async () => {
        acroInstance = await AcroContract.new();
        acroActorsInstance = await AcroActors.new(acroInstance.address);
    });

    // console.log(user1,user2,user3,user4, user5);

    it("The owner is in the whitelist", async() => {
        let res = await acroActorsInstance.is_actor(owner);
        expect(res.toString()).to.equal("true");
        // console.log(res);
        // assert.isTrue(res, "If this is false, something is wrong");
    });

    it("A user can register himself as an actor, and other actors", async() => {
             
        let newactor = await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        let res1 = await acroActorsInstance.get_actor_id(user1);
        // console.log(res1.toString());
        expect(res1.toString()).to.equal('0');

        let newactor2 = await acroActorsInstance.add_new_actor(user2,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        let res2 = await acroActorsInstance.get_actor_id(user2);
        // console.log(res2.toString());
        expect(res2.toString()).to.equal('1');

        let res3 = await acroActorsInstance.is_registered(user1);
        expect(res3.toString()).to.equal("true");

        let res4 = await acroActorsInstance.is_registered(user2);
        expect(res4.toString()).to.equal("true");


    });

    // Cas à prévoir: si un acteur possède plusieurs wallets?
    it("A user cannot register an actor (address!) already registered", async() => {
           
        let newactor = await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await expectRevert.unspecified(acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1}));
    });


    //Checking voting coef with acro_balance
    it("calculate the right voting coefficient according to staking balance", async() => {
        //Buying and staking process
        await this.acroInstance.buy_acro({from: user1, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
        let stakeAmount = new BN(2); // Stake Acro Tokens
        await this.acroInstance.approve(recipient, tokens(stakeAmount), {from: owner});
        await this.acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: user1});

        //Calculating voting coeff
        let votingCoef = await acroActorsInstance.votingCoefficient(user1, {from: user1});
        expect(votingCoef.toString()).to.equal(1);

    })

    it("A registered actor can vote for another registered actor", async() => {
        
        let registeredactor1 = await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        let registeredactor2 = await acroActorsInstance.add_new_actor(user2,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});

        let res = await acroActorsInstance.votingForActor(user2, {from: user1});
        await expectEvent(res, "votedEvent", {actorAddress: user2}, "Voted event incorrect");
        
        let checkres = await acroActorsInstance.get_actors_score_whitelist(user2)
        expect(checkres.toString()).to.equal("1");
        // console.log(checkres)
       
    });

    
    it("A non-registered actor cannot vote", async() => {

        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user1, {from: user2})); //

        // let checkres = await acroActorsInstance.get_actors_score_whitelist(user1)
        // expect(checkres.toString()).to.equal("0");
        // await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: user1}));
    });

    
    it("A registered actor cannot vote for himself", async() => {
        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user1, {from: user1})); //
        
    });

    it("A registered actor cannot vote for a non registered actor", async() => {
        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: user1})); //
        
    });

    it("A registered actor cannot vote twice (or more) for the same actor", async() => {
       
        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user2,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.votingForActor(user2, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: user1}));
        
    });

    //owner can validate actor
    it("Owner can validate an actor", async() => {

        //registering actors
        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user2,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user3,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user4,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});

        //the 3 registered actors vote for user3
        await acroActorsInstance.votingForActor(user3, {from: user1});
        await acroActorsInstance.votingForActor(user3, {from: user2});
        await acroActorsInstance.votingForActor(user3, {from: user4});

        let checkres = await acroActorsInstance.get_actors_score_whitelist(user3)
        expect(checkres.toString()).to.equal("3");

        //validation by owner
        await acroActorsInstance.validateActor(user3, {from: owner});
        let res = await acroActorsInstance.is_actor(user3); //function name is confusing: replace is_actor by is_whitelist
        expect(res.toString()).to.equal("true");

        let res2 = await acroActorsInstance.is_actor(user1);
        expect(res2.toString()).to.equal("false");
        
    });







});
