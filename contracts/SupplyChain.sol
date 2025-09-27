// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum State { Produced, ForSale, Shipped, Received, Sold }

    struct Product {
        uint sku;
        string name;
        address owner;
        State state;
    }

    uint public productCounter;
    mapping(uint => Product) public products;

    event ProductCreated(uint sku, string name, address owner);
    event ForSale(uint sku);
    event Shipped(uint sku);
    event Received(uint sku);
    event Sold(uint sku);

    modifier onlyProductOwner(uint _sku) {
        require(products[_sku].owner == msg.sender, "Not product owner");
        _;
    }

    function createProduct(string memory _name) public {
        productCounter++;
        products[productCounter] = Product({
            sku: productCounter,
            name: _name,
            owner: msg.sender,
            state: State.Produced
        });
        emit ProductCreated(productCounter, _name, msg.sender);
    }

    function markForSale(uint _sku) public onlyProductOwner(_sku) {
        products[_sku].state = State.ForSale;
        emit ForSale(_sku);
    }

    function shipProduct(uint _sku, address _to) public onlyProductOwner(_sku) {
        products[_sku].owner = _to;
        products[_sku].state = State.Shipped;
        emit Shipped(_sku);
    }

    function receiveProduct(uint _sku) public {
        require(products[_sku].state == State.Shipped, "Product not shipped");
        products[_sku].owner = msg.sender;
        products[_sku].state = State.Received;
        emit Received(_sku);
    }

    function sellProduct(uint _sku) public onlyProductOwner(_sku) {
        products[_sku].state = State.Sold;
        emit Sold(_sku);
    }

    function fetchProduct(uint _sku) public view returns (uint, string memory, address, State) {
        Product memory p = products[_sku];
        return (p.sku, p.name, p.owner, p.state);
    }
}
