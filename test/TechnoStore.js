const { expect } = require("chai");

require("chai")
    .use(require('chai-as-promised'))
    .should();

describe("TechnoStore contract", function () {
    let hardhatTechnoStore;

    before(async () => {
        const TechnoStore = await ethers.getContractFactory("TechnoStore");
        hardhatTechnoStore = await TechnoStore.deploy();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should be able to add products", async function() {
        const storeProductsCountInitial = await hardhatTechnoStore.getAvailableProducts();
        await hardhatTechnoStore.addProduct([1010, "MacBook Air", 1]);

        const storeProductsCountUpdated = await hardhatTechnoStore.getAvailableProducts();
        expect(storeProductsCountUpdated.length - storeProductsCountInitial.length).to.equal(1);

        const product = await hardhatTechnoStore.productList(1010);
        expect(product.id.toNumber()).to.equal(1010);
        expect(product.name).to.equal("MacBook Air");
        expect(product.stock.toNumber()).to.equal(1);

        // FAILURE: Try to add same product again
        await hardhatTechnoStore.addProduct([1010, "MacBook Pro 13", 1]).should.be.rejected;

        // FAILURE: Try to add same product when not and admin
        await hardhatTechnoStore.connect(addr1).addProduct([1010, "MacBook Pro 13", 1]).should.be.rejected;
    });

    it("Should be able to add stock to product", async function() {
        const initialProduct = await hardhatTechnoStore.productList(1010);

        await hardhatTechnoStore.addStock(1010, 1);
        const updatedProduct = await hardhatTechnoStore.productList(1010);
        expect(updatedProduct.stock.toNumber()-initialProduct.stock.toNumber()).to.equal(1);

        // FAILURE: Try to add stock for product that does not exists
        await hardhatTechnoStore.addStock(0, 10).should.be.rejected;

        // FAILURE: Try to add 0 stock to product
        await hardhatTechnoStore.addStock(1010, 0).should.be.rejected;
    });

    it("Should buy product by id", async function() {
        await hardhatTechnoStore.buyProduct(1010);
        const productsPurchase = await hardhatTechnoStore.productPurchases(1010, owner.address);
        expect(productsPurchase.toNumber()).to.greaterThan(0);

        // FAILURE: Try to buy same product again
        await hardhatTechnoStore.buyProduct(1010).should.be.rejected;

        // FAILURE: Try to buy product that does not exists
        await hardhatTechnoStore.buyProduct(0).should.be.rejected;

        // FAILURE: Try to buy same product again
        await hardhatTechnoStore.connect(addr1).buyProduct(1011).should.be.rejected;
    });

    it("Should return list of buyers of a product", async function() {
        const buyers = await hardhatTechnoStore.getBuyers(1010);
        expect(buyers).to.be.an('array').that.does.include(owner.address);
    });

    it("Should be able to return products", async function() {
        await hardhatTechnoStore.returnProduct(1010);
        const productsPurchase = await hardhatTechnoStore.productPurchases(1010, owner.address);
        expect(productsPurchase.toNumber()).to.equal(0);

        // FAILURE: Try to return product that was returned / not owned
        await hardhatTechnoStore.returnProduct(1010).should.be.rejected;
    })
})