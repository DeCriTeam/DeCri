// const { accounts, contract, provider } = require('@openzeppelin/test-environment');

const { expectEvent } = require('@openzeppelin/test-helpers');

const AcroContract = artifacts.require('Acro');

contract('Acro', function (accounts) {
    const [owner,account1,account2] = accounts;

    beforeEach(async function () {
        this.acroContract = await AcroContract.new({from: owner});
    });

    describe('construction', function () {
        it('initial state', async function () {
		console.log(this.acroContract.receipt);

            expect(await this.acroContract.owner()).to.equal(owner);
            expect(await this.acroContract.from).to.equal(owner);
		/*
	    console.log(this.acroContract);
	    let txHash = this.acroContract.transactionHash
	    console.log(txHash);
		/*
            let result = await truffleAssert.createTransactionResult(this.acroContract, txHash)
	    console.log(result);
	    console.log(result.from);
	    */

        });
    });
});
