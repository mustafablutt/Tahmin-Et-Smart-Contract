// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StockMarket2 {
    struct Stock {
        string name;
        uint256 shareCount;
    }

    Stock[] public stocks;
    address owner;

    // Her müşterinin her hisse senedinden kaç tane satın aldığını takip etmek için haritalama
    mapping(address => mapping(uint256 => uint256)) public customers;
    uint256 public marketOpen;
    uint256 public marketClose;

    constructor(string[] memory _stockNames, uint256 _durationInMinutes) {
        for (uint256 i = 0; i < _stockNames.length; i++) {
            stocks.push(Stock({
                name: _stockNames[i],
                shareCount: 0
            }));
        }
        owner = msg.sender;
        marketOpen = block.timestamp;
        marketClose = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function addStock(string memory _name) public onlyOwner {
        stocks.push(Stock({
            name: _name,
            shareCount: 0
        }));
    }

    function buyShares(uint256 _stockIndex, uint256 _stocks) public {
        require(_stockIndex < stocks.length, "Invalid candidate index.");
        
        stocks[_stockIndex].shareCount += _stocks;
        customers[msg.sender][_stockIndex] += _stocks;
    }

    function getAllSharesOfStocks() public view returns (Stock[] memory){
        return stocks;
    }

    function getMarketStatus() public view returns (bool) {
        return (block.timestamp >= marketOpen && block.timestamp < marketClose);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= marketOpen, "Market has not opened yet.");
        if (block.timestamp >= marketClose) {
            return 0;
        }
        return marketClose - block.timestamp;
    }
}
