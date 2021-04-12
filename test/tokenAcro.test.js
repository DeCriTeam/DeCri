// erc20.test.js
const { BN, expectEvent, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroContract = artifacts.require('Acro');


function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('Acro', function (accounts) {
    const _name = 'Acropora Token';
    const _symbol = 'ACRO';
    const _initialsupply = new BN(10000);
    const _decimals = new BN(18);
    const [owner,recipient,recipient2] = accounts;

    beforeEach(async function () {
        this.ERC20Instance = await AcroContract.new(_initialsupply,{from: owner});
        
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

        it('balance owner check', async function (){
            let balanceOwner = await this.ERC20Instance.balanceOf(owner); 
            let totalSupply = await this.ERC20Instance.totalSupply(); //l000 ok
            // console.log(balanceOwner, totalSupply); // FOR TESTING -> use this in Acro.sol constructor:  _mint(msg.sender, initialSupply);
            expect(balanceOwner).to.be.bignumber.equal(totalSupply);
        });

        it('transfer from owner to recipient is ok', async function (){
            let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(100);
            await this.ERC20Instance.transfer(recipient, amount, {from: owner});
            let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
            expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        });

        // If we split the contract in 2
        // it('transferFrom function is ok', async function () {
        //     let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
        //     let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
        //     let amount = new BN(10);
            
        //     await this.ERC20Instance.approve(recipient, amount, {from: owner});
        //     await this.ERC20Instance.transferFrom(owner, recipient, amount, {from: recipient});
            
        //     let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
        //     let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            
        //     expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
        //     expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        // })

      
        it('approval is ok', async function (){
            let allowanceSpenderBeforeApprove = await this.ERC20Instance.allowance(owner, recipient);
            let amount = new BN(10);
            await this.ERC20Instance.approve(recipient, amount, {from: owner});
            let allowanceSpenderAfterApprove = await this.ERC20Instance.allowance(owner, recipient);
            expect(allowanceSpenderAfterApprove).to.be.bignumber.equal(allowanceSpenderBeforeApprove.add(amount));
        });

        
        // tmp_buy_acro = transfer function
        // acro_donation: idem


        //  TO DO withdraw_ether:
        // + expectEvent
        // !!!!!!!!!!!!!! ISSUE HERE 
        it('selling functions', async function (){
            let AcroBalanceOfOwnerBeforeSelling = await this.ERC20Instance.balanceOf(owner);
            let AcroBalanceOfRecipientBeforeBuyin = await this.ERC20Instance.balanceOf(recipient);

            console.log('Acro Balance of Owner Before Selling: ', AcroBalanceOfOwnerBeforeSelling.toString());
            console.log('Acro Balance of Recipient Before Buying: ', AcroBalanceOfRecipientBeforeBuyin.toString());

            
            let ethBalanceThisContract_beforeSellingAccro = await web3.eth.getBalance(this.ERC20Instance.address);
            console.log('Eth Balance of Contract Before Selling Accro', ethBalanceThisContract_beforeSellingAccro.toString());
            
            //ISSUE HERE ---> FAIL
            //buying 2 acros for 1 eth
            let amount = new BN(0.1); //new BN(0.1); //??
            await this.ERC20Instance.tmp_buy_acro({ from: recipient, value: amount});
            
            let AcroBalanceOfOwnerAfterSelling = await this.ERC20Instance.balanceOf(owner);
            let AcroBalanceOfRecipientAfterBuyin = await this.ERC20Instance.balanceOf(recipient);
            console.log('Acro Balance of Owner After Selling: ', AcroBalanceOfOwnerAfterSelling.toString());
            console.log('Acro Balance of Recipient After Buying: ', AcroBalanceOfRecipientAfterBuyin.toString());

            
            // assert.equal( AcroBalanceOfOwnerAfterSelling.toString(), amount, "the contract's balance should be 1 ether");

            //TO DO: Donation function

            //TO DO: Withdraw function

        })

        
        //Staking and Unstaking Acro tokens -ok
            

        it('staking is ok', async function (){
            //  first making a transfert toward recipient
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(100);
            await this.ERC20Instance.transfer(recipient, amount, {from: owner});
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            // console.log(balanceRecipientAfterTransfer);
            expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
            assert.equal(tokens(balanceRecipientAfterTransfer.toString()), tokens('100'), 'investor Acro wallet balance correct before staking');
              
            // Stake Acro Tokens
            let stakeAmount = new BN(25);
            await this.ERC20Instance.approve(recipient, stakeAmount, {from: owner});
            await this.ERC20Instance.stakeAcroTokens(stakeAmount, { from: recipient });

            // Check investor Acro balance after staking
            let balanceRecipientAfterStaking = await this.ERC20Instance.balanceOf(recipient);
            assert.equal(tokens(balanceRecipientAfterStaking.toString()), tokens('75'), 'investor Acro wallet balance correct after staking');
        
            //investor staking balance      
            let investorStakingbalance = await this.ERC20Instance.stakingBalance(recipient);
             assert.equal(tokens(investorStakingbalance.toString()), tokens('25'), 'investor staking balance correct after staking');

            let stakerstatus = await this.ERC20Instance.isStaking(recipient);
            assert.equal(stakerstatus.toString(), 'true', 'investor staking status correct after staking');


            //Unstaking Acro tokens
            await this.ERC20Instance.unstakeTokens({from: recipient});
            //check results after unstaking
            let balanceRecipientAfterUnstaking = await this.ERC20Instance.balanceOf(recipient);
            // console.log(balanceRecipientAfterUnstaking);
            assert.equal(tokens(balanceRecipientAfterUnstaking.toString()), tokens('100'), 'recipient Acro wallet balance correct after staking');

            recipientStakingBalance = await this.ERC20Instance.stakingBalance(recipient);
            assert.equal(recipientStakingBalance.toString(), tokens('0'), 'recipient staking balance correct after staking');

            recipientStakingStatus = await this.ERC20Instance.isStaking(recipient);
            // console.log(recipientStakingStatus.toString());
            assert.equal(recipientStakingStatus.toString(), 'false', 'recipient staking status correct after staking');

        });

            
        
       

        });

     