// erc20.test.js
const { BN, expectEvent, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const AcroContract = artifacts.require('Acro');

contract('Acro', function (accounts) {
    const _name = 'Acropora Token';
    const _symbol = 'ACRO';
    const _initialsupply = new BN(100);
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
            let balanceOwner = await this.ERC20Instance.balanceOf(owner); //0 ?
            let totalSupply = await this.ERC20Instance.totalSupply(); //l00 ok
            // console.log(balanceOwner, totalSupply); ! use this in Acro.sol constructor:  _mint(msg.sender, initialSupply);
            expect(balanceOwner).to.be.bignumber.equal(totalSupply);
        });

        it('transfer from owner to recipient is ok', async function (){
            let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(10);
            await this.ERC20Instance.transfer(recipient, amount, {from: owner});
            let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
            expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        });

    
        it('transferFrom function is ok', async function () {
            let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(10);
            
            await this.ERC20Instance.approve(recipient, amount, {from: owner});
            await this.ERC20Instance.transferFrom(owner, recipient, amount, {from: recipient});
            
            let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            
            expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
            expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        })

      
        it('approval is ok', async function (){
            let allowanceSpenderBeforeApprove = await this.ERC20Instance.allowance(owner, recipient);
            let amount = new BN(10);
            await this.ERC20Instance.approve(recipient, amount, {from: owner});
            let allowanceSpenderAfterApprove = await this.ERC20Instance.allowance(owner, recipient);
            expect(allowanceSpenderAfterApprove).to.be.bignumber.equal(allowanceSpenderBeforeApprove.add(amount));
        });

        //TO DO: Test functions of AcroBank  + expectEvent
        // tmp_buy_acro
        // acro_donation
        // withdraw_ether
        
       

        });

     