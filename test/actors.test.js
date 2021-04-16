// actors.test.js
const { BN, expectEvent, expectRevert, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroActors = artifacts.require('AcroActors');
const AcroContract = artifacts.require('Acro');

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

function convertfromWei(n) {
    return web3.utils.fromWei(n, 'ether');
}

contract('AcroActors', async accounts => {

    var acroInstance;
    var acroActorsInstance;
    
    const [owner,user1,user2,user3,user4, user5] = accounts;
    
    beforeEach('setup contract for each test case', async () => {
        acroInstance = await AcroContract.new();
        acroActorsInstance = await AcroActors.new(acroInstance.address);
    });

    //#1: ok!
    it("The owner is in the whitelist", async() => {
        let res = await acroActorsInstance.is_validated_actor(owner);
        expect(res.toString()).to.equal("true");
    });

    //#2: ok!
    it("A user can register himself as an actor, and other actors", async() => {
        let newactor = await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});

        let newactor2 = await acroActorsInstance.add_new_actor(user2,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});
        let count = await acroActorsInstance.get_actors_count();
        expect(count).to.bignumber.equal(new BN('3'));
    });

    it("A user cannot register an actor (address!) already registered", async() => {
        let newactor = await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});

        await expectRevert( acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1}), "Actor already registered");
    });

    //Checking voting coef with acro_balance
    it("calculate the right voting coefficient according to staking balance", async() => {
        //Buying and staking process
        await acroInstance.buy_acro({from: user1, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
        let stakeAmount = new BN(2); // Stake Acro Tokens
        await acroInstance.approve(user1, tokens(stakeAmount), {from: owner});
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: user1});

        //Calculating voting coeff
        let votingCoef = await acroActorsInstance.votingCoefficient(user1, {from: user1});
        expect(votingCoef.toString()).to.equal('1');
    })

    //#5 The registered actor below did not stake
    it("A registered actor can vote for another registered actor", async() => {
        let newactor = await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});

        let newactor2 = await acroActorsInstance.add_new_actor(user2,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});

        let res = await acroActorsInstance.votingForActor(user2, {from: owner});
        await expectEvent(res, "votedEvent", {actorAddress: user2}, "Voted event incorrect");
        
        let checkres = await acroActorsInstance.RegisteredActors(user2);
        expect(checkres.vote_score).to.bignumber.equal(new BN("0"));
    });

    //#6 The registred actor staked two acro, its voting coefficient is 1
    it("A registered actor can vote for another registered actor - its weight is higher because he staked some Acros", async() => {
        let newactor = await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});

        let newactor2 = await acroActorsInstance.add_new_actor(user2,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});

        //user1 buy and stake acro
        await acroInstance.buy_acro({from: owner, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
        let stakeAmount = new BN(2); // Stake Acro Tokens
        // await acroInstance.approve(user1, tokens(stakeAmount), {from: user1});
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: owner});

        let res = await acroActorsInstance.votingForActor(user2, {from: owner});
        await expectEvent(res, "votedEvent", {actorAddress: user2}, "Voted event incorrect");
        
        let checkres = await acroActorsInstance.RegisteredActors(user2);
        expect(checkres.vote_score).to.bignumber.equal(new BN("1"));
    });

    // #7
    it("A non-registered actor cannot vote", async() => {
        await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});
        await acroActorsInstance.add_new_actor(user2,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user2});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user1, {from: user2})); 
    });

    // #8
    it("A registered actor cannot vote for himself", async() => {
        await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user1, {from: user1})); 
        
    });

/*
    // #9
    it("A registered actor cannot vote for a non registered actor", async() => {
        await acroActorsInstance.add_new_actor(user1,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user1});
        await acroActorsInstance.add_new_actor(user2,{
           actorName:"MDC",
           country:"US",
           latCenter:new BN('10'),
           longCenter:new BN('20'),
           yearOfCreation:new BN('2020'),
           email:"email@",
           actorType: new BN(AcroActors.ActorTypes.DIVING_CLUB),
           dateOfRegistration:"13/04/2021",
           vote_score:0
        }, {from: user2});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: owner }));
    });
    // #10
    it("A registered actor cannot vote twice (or more) for the same actor", async() => {
       
        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user2,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.votingForActor(user2, {from: user1});
        await expectRevert.unspecified(acroActorsInstance.votingForActor(user2, {from: user1}));
        
    });

    //#11 owner can validate actor
    it("Owner can validate an actor", async() => {

        //registering actors
        await acroActorsInstance.add_new_actor(user1,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user2,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user3,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});
        await acroActorsInstance.add_new_actor(user4,"MDC","US",10,20,2020,"email@", "diving club","13/04/2021", {from: user1});

        // the 3 registered buy and stake 2 accros
        let stakeAmount = new BN(2); // Stake Acro Tokens
        await acroInstance.buy_acro({from: user1, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
        await acroInstance.approve(user1, tokens(stakeAmount), {from: owner});
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: user1});

        await acroInstance.buy_acro({from: user2, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
        await acroInstance.approve(user2, tokens(stakeAmount), {from: owner});
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: user2});

        await acroInstance.buy_acro({from: user4, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
        await acroInstance.approve(user4, tokens(stakeAmount), {from: owner});
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: user4});

        //the 3 registered actors vote for user3 - their voting coefficient is 1 since they stake 2 acro
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
*/






});
