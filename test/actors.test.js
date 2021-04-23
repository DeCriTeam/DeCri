// actors.test.js
const { BN, expectEvent, expectRevert, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroActors = artifacts.require('AcroActors');
const AcroContract = artifacts.require('Acro');

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}


contract('AcroActors', async accounts => {

    var acroInstance;
    var acroActorsInstance;
    
    const [owner,user1,user2,user3,user4, user5] = accounts;
    
    beforeEach('setup contract for each test case', async () => {
        acroInstance = await AcroContract.new();
        acroActorsInstance = await AcroActors.new(acroInstance.address);
    });

    it("The owner is in the whitelist", async() => {
        let res = await acroActorsInstance.is_validated_actor(owner);
        expect(res.toString()).to.equal("true");
    });

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
        expect(count).to.bignumber.equal(new BN('7'));

        await expectEvent(newactor, "ActorRegistered", {actorAddress: user1}, "Registering Actor1 event incorrect");
        await expectEvent(newactor2, "ActorRegistered", {actorAddress: user2}, "Registering Actor2 event incorrect");
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

    it("calculate the right voting coefficient according to staking balance", async() => {
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
        // Buying and staking process
        await acroInstance.buy_acro({from: user1, value:web3.utils.toWei('0.5', "ether")}); //buying 10 Acro
        let stakeAmount = new BN(10); // Stake Acro Tokens
        // await acroInstance.approve(user1, web3.utils.toWei('10','ether'), {from: owner});
        await acroInstance.stakeAcroTokens(web3.utils.toWei('10','ether'), {from: user1});

        // Calculating voting coeff
        let votingCoef = await acroActorsInstance.votingCoefficient(user1, {from: user1});
        expect(votingCoef.toString()).to.equal('1');
        console.log(votingCoef.toString());
    })

    it("A validated actor can vote for another registered actor", async() => {
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

        let checkres0 = await acroActorsInstance.RegisteredActors(user2);
        expect(checkres0.vote_score).to.bignumber.equal(new BN("0"));

        await acroInstance.buy_acro({from: owner, value:web3.utils.toWei('0.5', "ether")});
        let stakeAmount = new BN(10);
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: owner});

        let res = await acroActorsInstance.votingForActor(user2, {from: owner});
        await expectEvent(res, "votedEvent", {actorAddress: user2}, "Voted event is emitted");
        
        let checkres = await acroActorsInstance.RegisteredActors(user2);
        expect(checkres.vote_score).to.bignumber.equal(new BN("1"));
    });

    it("A non-validated actor cannot vote", async() => {
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

        await acroInstance.buy_acro({from: user1, value:web3.utils.toWei('0.5', "ether")});
        let stakeAmount = new BN(10);
        await acroInstance.stakeAcroTokens(tokens(stakeAmount), {from: user1});

        await expectRevert( acroActorsInstance.votingForActor(user2, {from: user1}), "Voter must be validated" );
    });
});
