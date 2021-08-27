const {ethers} = require("hardhat")
const {use, expect} = require("chai")
const {solidity} = require("ethereum-waffle");

use(solidity);

describe("Contract", function () {
    before(async function () {
        this.CONTRACT = await ethers.getContractFactory("ContractHandshake")
        this.signers = await ethers.getSigners()
        this.alpha = this.signers[0]
        this.beta = this.signers[1]
        this.omega = this.signers[2]
        this.agreement = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis, quam at " +
            "malesuada aliquam, magna purus pharetra justo, at dictum felis leo in massa. Vivamus iaculis euismod " +
            "nisi vitae efficitur. Sed mattis lobortis tortor vel ullamcorper. Nunc eget rhoncus ligula. Curabitur " +
            "convallis, augue non aliquet volutpat, ex nisi porttitor dolor, eget mollis lectus metus at ipsum. " +
            "Etiam varius, erat ac aliquet vulputate, nulla felis ornare nisi, et luctus ante nulla ut sapien. "+
            "Aliquam erat volutpat. Aliquam molestie dolor id pellentesque sodales. Donec eu feugiat sapien.\n" +
            "Fusce tristique pharetra lacus, at malesuada tortor faucibus ac. Morbi lorem metus, fermentum eu " +
            "sapien quis, malesuada maximus quam. Maecenas vel luctus orci. Curabitur turpis lacus, vehicula finibus "+
            "ligula ut, pharetra blandit eros. Curabitur aliquam libero et auctor tincidunt. Aenean nec tincidunt "+
            "erat. Integer hendrerit, felis eu tincidunt mattis, purus ligula finibus nunc, et tristique augue sapien "+
            "et tortor. Mauris eu nulla id turpis bibendum consequat ut eu nisl. Ut malesuada erat at ultricies "+
            "dapibus. Vivamus fringilla fringilla diam, vitae imperdiet sem pretium id."
        this.signers = [this.alpha.address, this.beta.address]
    })

    beforeEach(async function () {
        this.contract = await this.CONTRACT.deploy(this.signers, this.agreement)
        await this.contract.deployed()
    })

    it("should return false for both signers", async function () {
        expect(await this.contract.allPartiesHaveSigned()).to.equal(false)
        expect(await this.contract.signatureCount()).to.equal(0)
        expect(await this.contract.hasSigned(this.alpha.address)).to.equal(false)
        expect(await this.contract.hasSigned(this.beta.address)).to.equal(false)
        expect(await this.contract.getAgreement()).to.equal(this.agreement);
    })

    it("should only allow whitelisted signers to sign", async function () {
        await expect(this.contract.connect(this.omega).sign())
            .to.be.revertedWith("Can only be called by whitelisted signers")
        expect(await this.contract.signatureCount()).to.equal(0)
        expect(await this.contract.allPartiesHaveSigned()).to.equal(false)
    })

    it("should allow white listed signers to sign", async function () {
        await expect(await this.contract.connect(this.alpha).sign())
            .to.emit(this.contract, "Signature")
            .withArgs(this.alpha.address)
        expect(await this.contract.hasSigned(this.alpha.address)).to.equal(true)

        expect(await this.contract.allPartiesHaveSigned()).to.equal(false)
        expect(await this.contract.signatureCount()).to.equal(1)

        await expect(await this.contract.connect(this.beta).sign())
            .to.emit(this.contract, "Signature")
            .withArgs(this.beta.address)
        expect(await this.contract.hasSigned(this.beta.address)).to.equal(true)

        expect(await this.contract.allPartiesHaveSigned()).to.equal(true)
        expect(await this.contract.signatureCount()).to.equal(2)
    })
})
