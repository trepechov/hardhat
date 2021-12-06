// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "./Ownable.sol";

contract TechnoStore is Ownable {

    struct StoreProduct {
        uint id;
        string name;
        uint stock;
    }

    uint[] public availableProducts;
    mapping(uint => StoreProduct) public productList;
    mapping(uint => mapping(address => uint)) public productPurchases;
    mapping(uint => address[]) public productsEverPurchased;

    modifier productExists(uint productId) {
        require(productList[productId].id != 0, "Product doesn't exist");
        _;
    }

    constructor() {
        // Add some products to store
        StoreProduct memory product1 = StoreProduct(1001, "MacBook Pro", 1);
        addProduct(product1);
        StoreProduct memory product2 = StoreProduct(1002, "iPad Pro", 5);
        addProduct(product2);
    }

    function getAvailableProducts() public view returns(uint[] memory) {
        return availableProducts;
    }

    function getBuyers(uint productId) public view returns(address[] memory){
        return productsEverPurchased[productId];
    }

    function addProduct(StoreProduct memory product) public onlyOwner  {
        require(product.stock > 0, "Product stock should be greater than 0");
        require(productList[product.id].id == 0, "Product already exists");

        productList[product.id] = product;
        availableProducts.push(product.id);
    }

    function addStock(uint productId, uint stockAmount) public onlyOwner productExists(productId) {
        require(stockAmount > 0, "Product stock should be greater than 0");
        productList[productId].stock += stockAmount;
        if (productList[productId].stock == stockAmount) {
            availableProducts.push(productId);
        }
    }

    function removeStock(uint productId) private {
        productList[productId].stock -= 1;
        if (productList[productId].stock == 0) {
            for (uint i = 0; i < availableProducts.length; i++) {
                if (availableProducts[i] == productId) {
                    delete availableProducts[i];
                }
            }
        }
    }

    function buyProduct(uint productId) public productExists(productId) {
        require(productPurchases[productId][msg.sender] == 0, "Address already owns this product");
        require(productList[productId].stock > 0, "Product is out of stock");

        productPurchases[productId][msg.sender] = block.number;
        removeStock(productId);
        productsEverPurchased[productId].push(msg.sender);
    }

    function returnProduct(uint productId) public {
        require(productPurchases[productId][msg.sender] != 0, "Address doesn't own this product");
        require(block.number - productPurchases[productId][msg.sender] < 100, "Sorry but it's too late to return this product");

        addStock(productId, 1);
        delete productPurchases[productId][msg.sender];
    }
}