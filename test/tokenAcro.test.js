// erc20.test.js
const { BN, expectEvent, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroContract = artifacts.require('Acro');

//In console do not forget to install: npm i ganache-time-traveler
const timeMachine = require('ganache-time-traveler');


function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

function convertfromWei(n) {
    return web3.utils.fromWei(n, 'ether');
}

contract('Acro', function (accounts) {
    const _name = 'Acropora Token';
    const _symbol = 'ACRO';
    const _initialsupply = new BN(10000);
    const _decimals = new BN(18);
    const [owner,recipient,recipient2] = accounts;

    beforeEach(async function () {
        // this.ERC20Instance = await AcroContract.new(_initialsupply,{from: owner});
        this.ERC20Instance = await AcroContract.new({from: owner});
    });

    
        it('initial state', async function () {
		    expect(await this.ERC20Instance.owner()).to.equal(owner); 
            // expect(await this.ERC20Instance.from).to.equal(owner);
        });
    
        // ERC20 functions

        it('has a name', async function () {
            expect(await this.ERC20Instance.name()).to.equal(_name);
        });

        it('has a symbol', async function () {
            expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
        });

        it('has a decimal value', async function () {
            expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
        });

        it('contract balance check', async function (){
            // let balanceOwner = await this.ERC20Instance.balanceOf(owner);
            let mintedAcro = new BN(10000);
            let totalSupply = await this.ERC20Instance.totalSupply(); //Accro balance in Wei 
            console.log('Acro contract balance: ', convertfromWei(totalSupply.toString())); //Accro balance in ether value (/10^18)
            expect(convertfromWei(totalSupply)).to.be.bignumber.equal(mintedAcro);
        });

        it('buying accro', async function (){
            // let balance = await web3.eth.getBalance(instance.address);
            let acroBalanceContract = await this.ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            // console.log(acroBalanceContract.toString());
            // let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
            
            
            await this.ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('0.1', "ether")});
            // await this.ERC20Instance.transfer(recipient, amount, {from: owner});
            
            let balanceContractAfterTransfer = await this.ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            console.log('balance contract after buy: ',convertfromWei(balanceContractAfterTransfer.toString()));
            console.log('balance recipient after buy: ',convertfromWei(balanceRecipientAfterTransfer.toString()));
            balancecontractAT = convertfromWei(balanceContractAfterTransfer.toString());
            balancecontractBT = convertfromWei(acroBalanceContract.toString());
            // console.log(balancecontractAT,balancecontractBT);
            balanceRecipientBT = convertfromWei(balanceRecipientBeforeTransfer.toString());
            balanceRecipientAT = convertfromWei(balanceRecipientAfterTransfer.toString());
            // console.log(balanceRecipientBT,balanceRecipientAT);

            expect(balancecontractAT).to.equal('9998');
            expect(balanceRecipientAT).to.equal('2');

            // let nbtokens = new BN(2);
            // console.log(nbtokens);
            // expect(balanceContractAfterTransfer).to.be.bignumber.equal(acroBalanceContract.sub(nbtokens));
            // expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        });

        // // If we split the contract in 2
        // // it('transferFrom function is ok', async function () {
        // //     let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
        // //     let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
        // //     let amount = new BN(10);
            
        // //     await this.ERC20Instance.approve(recipient, amount, {from: owner});
        // //     await this.ERC20Instance.transferFrom(owner, recipient, amount, {from: recipient});
            
        // //     let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
        // //     let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            
        // //     expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
        // //     expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        // // })

      
        // it('approval is ok', async function (){
        //     let allowanceSpenderBeforeApprove = await this.ERC20Instance.allowance(owner, recipient);
        //     let amount = new BN(10);
        //     await this.ERC20Instance.approve(recipient, amount, {from: owner});
        //     let allowanceSpenderAfterApprove = await this.ERC20Instance.allowance(owner, recipient);
        //     expect(allowanceSpenderAfterApprove).to.be.bignumber.equal(allowanceSpenderBeforeApprove.add(amount));
        // });

        
        // donating accro
        it('donate accro to contract', async function (){
            let acroBalanceContract = await this.ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
                        
            await this.ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
            await this.ERC20Instance.acro_donation(web3.utils.toWei('1','ether'), { from: recipient }); //giving 1 Acro
                       
            let balanceContractAfterTransfer = await this.ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            console.log('balance contract after buy: ',convertfromWei(balanceContractAfterTransfer.toString()));
            console.log('balance recipient after buy: ',convertfromWei(balanceRecipientAfterTransfer.toString()));
            balancecontractAT = convertfromWei(balanceContractAfterTransfer.toString());
            balancecontractBT = convertfromWei(acroBalanceContract.toString());
            console.log(balancecontractAT,balancecontractBT);
            balanceRecipientBT = convertfromWei(balanceRecipientBeforeTransfer.toString());
            balanceRecipientAT = convertfromWei(balanceRecipientAfterTransfer.toString());
            console.log(balanceRecipientBT,balanceRecipientAT);

            expect(balancecontractAT).to.equal('9999');
            expect(balanceRecipientAT).to.equal('1');
        
        });


        // //  TO DO withdraw_ether:
        // // + expectEvent
        
       
        // //Staking and Unstaking Acro tokens -ok
            
        it('staking is ok', async function (){
            //  first buying Acro
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(2);
            
            await this.ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro

            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            // console.log(balanceRecipientAfterTransfer);
            // expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
            assert.equal(balanceRecipientAfterTransfer.toString(), tokens('2'), 'investor Acro wallet balance correct before staking');
              
            // Stake Acro Tokens
            let stakeAmount = new BN(2);
            await this.ERC20Instance.approve(recipient, tokens(stakeAmount), {from: owner});
            await this.ERC20Instance.stakeAcroTokens(tokens(stakeAmount), { from: recipient });

            // Check investor Acro balance after staking
            let balanceRecipientAfterStaking = await this.ERC20Instance.balanceOf(recipient);
            console.log(balanceRecipientAfterStaking.toString());
            assert.equal(tokens(balanceRecipientAfterStaking.toString()), tokens('0'), 'investor Acro wallet balance correct after staking');
        
            //investor staking balance      
            let investorStakingbalance = await this.ERC20Instance.stakingBalance(recipient);
            assert.equal(investorStakingbalance.toString(), tokens('2'), 'investor staking balance correct after staking');

            let stakerstatus = await this.ERC20Instance.isStaking(recipient);
            assert.equal(stakerstatus.toString(), 'true', 'investor staking status correct after staking');


            //Unstaking Acro tokens
            await timeMachine.advanceTimeAndBlock(1800);//1800 s, i.e. 30 min

            await this.ERC20Instance.unstakeTokens({from: recipient});
            //check results after unstaking
            let balanceRecipientAfterUnstaking = await this.ERC20Instance.balanceOf(recipient);
            // console.log(balanceRecipientAfterUnstaking);
            // assert.equal((balanceRecipientAfterUnstaking.toString()), tokens('0'), 'recipient Acro wallet balance correct after staking');

            recipientStakingBalance = await this.ERC20Instance.stakingBalance(recipient);
            assert.equal(recipientStakingBalance.toString(), tokens('0'), 'recipient staking balance correct after staking');

            recipientStakingStatus = await this.ERC20Instance.isStaking(recipient);
            // console.log(recipientStakingStatus.toString());
            assert.equal(recipientStakingStatus.toString(), 'false', 'recipient staking status correct after staking');

        });

            
        
       

        });

     
