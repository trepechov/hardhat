const { expect } = require("chai");

require("chai")
    .use(require('chai-as-promised'))
    .should();

describe("USElection contract", function () {
    let hardhatUSElection;

    before(async () => {
        const USElection = await ethers.getContractFactory("USElection");
        hardhatUSElection = await USElection.deploy();
    });

    it("should submit state result", async function() {
        await hardhatUSElection.submitStateResult(["California", 11110250, 6006429, 40]);

        const seatsBiden = await hardhatUSElection.seats(1);
        expect(seatsBiden).to.equal(40);

        const californiaSubmitted = await hardhatUSElection.resultsSubmitted("California");
        expect(californiaSubmitted).to.equal(true);

        // FAILUER: Try to summit result with equal amount of votes
        await hardhatUSElection.submitStateResult(["Texas", 1000000, 1000000, 12]).should.be.rejected;

        // FAILUER: Try to summit result with 0 seats
        await hardhatUSElection.submitStateResult(["Texas", 5259126, 5890347, 0]).should.be.rejected;

        // FAILUER: Try to summit again submitted state
        await hardhatUSElection.submitStateResult(["California", 11110250, 6006429, 40]).should.be.rejected;
    })

    it("should get current leader", async function() {
        const currentLeader = await hardhatUSElection.currentLeader();

        expect(currentLeader).to.equal(1)
    });

    it("Should ends elections", async function() {
        const electionsNotEnded = await hardhatUSElection.electionEnded();
        expect(electionsNotEnded).to.equal(false);

        await hardhatUSElection.endElection();
        const electionsEnded = await hardhatUSElection.electionEnded();
        expect(electionsEnded).to.equal(true);
    });
});