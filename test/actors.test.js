// actors.test.js
const { BN, expectEvent, expectRevert, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroActors = artifacts.require('AcroActors');

contract('AcroActors', async accounts => {

    var acroActorsInstance;

    const [owner,user1,user2,user3,user4, user5] = accounts;
    

    beforeEach('setup contract for each test case', async () => {
        acroActorsInstance = await AcroActors.new({from: owner});
    });

    console.log(user1,user2,user3,user4, user5);

    it("The owner is in the whitelist", async() => {
        let res = await acroActorsInstance.is_actor(owner);
        expect(res.toString()).to.equal("true");
        // console.log(res);
        // assert.isTrue(res, "If this is false, something is wrong");
    });

    it("A user can register himself as an actor, and other actors", async() => {
        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";
         
        let newactor = await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        let res1 = await acroActorsInstance.get_actor_id(user1);
        // console.log(res1.toString());
        expect(res1.toString()).to.equal('0');

        let newactor2 = await acroActorsInstance.add_new_actor(user2,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
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
        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";
         
        let newactor = await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1}));
    });



    it("A registered actor can vote for another registered actor", async() => {
        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";

        let registeredactor1 = await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        let registeredactor2 = await acroActorsInstance.add_new_actor(user2,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});

        let res = await acroActorsInstance.votingForActor(user2, {from: user1});
        await expectEvent(res, "votedEvent", {actorAddress: user2}, "Voted event incorrect");
        
        let checkres = await acroActorsInstance.get_actors_score_whitelist(user2)
        expect(checkres.toString()).to.equal("1");
        // console.log(checkres)
       
    });

    
    it("A non-registered actor cannot vote", async() => {

        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";

        await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user1, {from: user2})); //

        // let checkres = await acroActorsInstance.get_actors_score_whitelist(user1)
        // expect(checkres.toString()).to.equal("0");
        // await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: user1}));
    });

    
    it("A registered actor cannot vote for himself", async() => {

        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";

        await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user1, {from: user1})); //
        
    });

    it("A registered actor cannot vote for a non registered actor", async() => {

        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";

        await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: user1})); //
        
    });

    //owner can validate actor
    it("Owner can validate an actor", async() => {

        actorName = "Manta Diving Club";
        country = "US";
        lat = 10;
        long = 20;
        yearOfCreation = 2020;
        email = "mantaclub@gmail.com";
        actortype = "Diving Club";
        dateE = "11/04/2021";

        //registering actors
        await acroActorsInstance.add_new_actor(user1,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await acroActorsInstance.add_new_actor(user2,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await acroActorsInstance.add_new_actor(user3,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});
        await acroActorsInstance.add_new_actor(user4,actorName,country,lat,long,yearOfCreation,email, actortype,dateE, {from: user1});

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
