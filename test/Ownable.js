const { expect } = require("chai");

describe("Ownable contract", function () {
    it("Deployment should assign the owner", async function () {
        const [owner] = await ethers.getSigners();

        const Ownable = await ethers.getContractFactory("Ownable");

        const hardhatOwnable = await Ownable.deploy();

        //console.log(hardhatOwnable, owner.address);
        const ownerAddress = await hardhatOwnable.owner();
        expect(ownerAddress).to.equal(owner.address);
    });
});