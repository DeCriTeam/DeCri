// erc20.test.js
const { BN, expectEvent, expectRevert, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroContract = artifacts.require('Acro');

//In console do not forget to install: npm i ganache-time-traveler
//!! works only locally
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
        ERC20Instance = await AcroContract.new({from: owner});
    });

    
        it('initial state', async function () {
		    expect(await ERC20Instance.owner()).to.equal(owner); 
        });
    

        // ERC20 functions

        it('has a name', async function () {
            expect(await ERC20Instance.name()).to.equal(_name);
        });

        it('has a symbol', async function () {
            expect(await ERC20Instance.symbol()).to.equal(_symbol);
        });

        it('has a decimal value', async function () {
            expect(await ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
        });

        it('contract balance check', async function (){
            // let balanceOwner = await this.ERC20Instance.balanceOf(owner);
            let mintedAcro = new BN(10000);
            let totalSupply = await ERC20Instance.totalSupply(); //Accro balance in Wei 
            console.log('Acro contract balance: ', convertfromWei(totalSupply.toString())); //Accro balance in ether value (/10^18)
            expect(convertfromWei(totalSupply)).to.be.bignumber.equal(mintedAcro);
        });

        it('buying accro', async function (){
            // let balance = await web3.eth.getBalance(instance.address);
            let acroBalanceContract = await ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientBeforeTransfer = await ERC20Instance.balanceOf(recipient);
            // console.log(acroBalanceContract.toString());
            // let balanceOwnerBeforeTransfer = await ERC20Instance.balanceOf(owner);
            
            
            await ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('0.1', "ether")});
            // await ERC20Instance.transfer(recipient, amount, {from: owner});
            
            let balanceContractAfterTransfer = await ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientAfterTransfer = await ERC20Instance.balanceOf(recipient);
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

             
        // it('approval is ok', async function (){
        //     let allowanceSpenderBeforeApprove = await ERC20Instance.allowance(owner, recipient);
        //     let amount = new BN(10);
        //     await ERC20Instance.approve(recipient, amount, {from: owner});
        //     let allowanceSpenderAfterApprove = await ERC20Instance.allowance(owner, recipient);
        //     expect(allowanceSpenderAfterApprove).to.be.bignumber.equal(allowanceSpenderBeforeApprove.add(amount));
        // });

        
        // donating accro
        it('donate accro to contract', async function (){
            let acroBalanceContract = await ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientBeforeTransfer = await ERC20Instance.balanceOf(recipient);
                        
            await ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro
            await ERC20Instance.acro_donation(web3.utils.toWei('1','ether'), { from: recipient }); //giving 1 Acro
                       
            let balanceContractAfterTransfer = await ERC20Instance.get_acro_balance_of_this_contract();
            let balanceRecipientAfterTransfer = await ERC20Instance.balanceOf(recipient);
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


               
        // non-owner cannot withdraw ether from contract


        // //Staking and Unstaking Acro tokens -ok
            
        it('staking is ok', async function (){
            //  first buying Acro
            let balanceRecipientBeforeTransfer = await ERC20Instance.balanceOf(recipient);
            let amount = new BN(2);
            
            await ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('0.1', "ether")}); //buying 2 Acro

            let balanceRecipientAfterTransfer = await ERC20Instance.balanceOf(recipient);
            // console.log(balanceRecipientAfterTransfer);
            // expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
            assert.equal(balanceRecipientAfterTransfer.toString(), tokens('2'), 'investor Acro wallet balance correct before staking');
              
            // Stake Acro Tokens
            let stakeAmount = new BN(2);
            await ERC20Instance.approve(recipient, tokens(stakeAmount), {from: owner});
            await ERC20Instance.stakeAcroTokens(tokens(stakeAmount), { from: recipient });

            // Check investor Acro balance after staking
            let balanceRecipientAfterStaking = await ERC20Instance.balanceOf(recipient);
            // console.log(balanceRecipientAfterStaking.toString());
            assert.equal(tokens(balanceRecipientAfterStaking.toString()), tokens('0'), 'investor Acro wallet balance correct after staking');
        
            //investor staking balance      
            let investorStakingbalance = await ERC20Instance.stakingBalance(recipient);
            assert.equal(investorStakingbalance.toString(), tokens('2'), 'investor staking balance correct after staking');

            let stakerstatus = await ERC20Instance.is_staking_acro(recipient);
            assert.equal(stakerstatus.toString(), 'true', 'investor staking status correct after staking');


            let chain_id = await web3.eth.getChainId();
            if (chain_id==1337) {
              //Unstaking Acro tokens
              await timeMachine.advanceTimeAndBlock(16*24*60*60);//16 days

              await ERC20Instance.unstakeTokens({from: recipient});
              //check results after unstaking
              let balanceRecipientAfterUnstaking = await ERC20Instance.balanceOf(recipient);
              // console.log(balanceRecipientAfterUnstaking);
              // assert.equal((balanceRecipientAfterUnstaking.toString()), tokens('0'), 'recipient Acro wallet balance correct after staking');

              recipientStakingBalance = await ERC20Instance.stakingBalance(recipient);
              assert.equal(recipientStakingBalance.toString(), tokens('0'), 'recipient staking balance correct after staking');

              recipientStakingStatus = await ERC20Instance.is_staking_acro(recipient);
              // console.log(recipientStakingStatus.toString());
              assert.equal(recipientStakingStatus.toString(), 'false', 'recipient staking status correct after staking');
            }

        });

        ////  TO DO expectEvent
        
        it('only owner can withdraw ether from contract', async function (){
            //first a user buy some acros, ether are transfert
            await ERC20Instance.buy_acro({from: recipient, value:web3.utils.toWei('2', "ether")}); //buying 2 Acro
            

            //check balance in ether of contract
            let balanceContractBeforeWithdraw = await ERC20Instance.get_ether_balance_of_this_contract();
            console.log('Contract balance in eth BEFORE withdraw:', convertfromWei(balanceContractBeforeWithdraw.toString()));

            // Non owner withdraw half of the amount
            let withdrawAmount = new BN(1);
            await expectRevert.unspecified(ERC20Instance.withdraw_ether(tokens(withdrawAmount),{from: recipient}));
            
            // Owner withdraw half of the amount
            let res = await ERC20Instance.withdraw_ether(tokens(withdrawAmount),{from: owner});
            
           
            //check balance in ether of contract after the withdraw
            let balanceContractAfterWithdraw = await ERC20Instance.get_ether_balance_of_this_contract();
            console.log('Contract balance in eth AFTER withdraw:', convertfromWei(balanceContractAfterWithdraw.toString()));
            assert.equal(balanceContractAfterWithdraw.toString(), tokens('1'), 'Contract balance in eth correct after withdraw');

            
        });

            
        
       

        });

     
