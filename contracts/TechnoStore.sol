// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "./Ownable.sol";

contract TechnoStore is Ownable {

    struct StoreProduct { // Should I use struct for products or can be id->name map
        uint id;
        string name;
    }

    mapping(uint => StoreProduct) public productList;
    mapping(uint => uint) public productStock;
    mapping(uint => mapping(address => bool)) public productPurchases; //Is it a good idea to store the purchase time instead of the true/false value here

    function addProduct(StoreProduct calldata product, uint quantity) public onlyOwner {
        // require(productList[product.id] == 0, "Product already exists");
        productList[product.id] = product;
        productStock[product.id] = quantity;
    }

    // Should I have updateProduct function to update the stock or this could be implemented
    // function updateProduct(uint productId, uint quantity) public onlyOwner {
    //     //require(!productList[productId], "Product does't exist");
    //     productStock[productId] = quantity;
    // }

    function buyProduct(uint productId) public {
        require(!productPurchases[productId][msg.sender], "Address already owns this product");
        require(productStock[productId] > 0, "Product is out of stock");

        // TODO add block number to purchas and validation
        productPurchases[productId][msg.sender] = true;
        productStock[productId] -= 1;
    }

    function returnProduct(uint productId) public {
        require(productPurchases[productId][msg.sender], "Address doesn't own this product");
        //require(block.number - productPurchases[productId][msg.sender] > 100, "Sorry but it's too late to return this product");

        productStock[productId] += 1;
        productPurchases[productId][msg.sender] = false;
    }

    // function getProducts() public view returns () {
    // How should be structured the result
    // }

    // function getBuyersOfProduct(uint productId) public {
    // How should be structured the result
    // }
}