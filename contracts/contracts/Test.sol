// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Test {
    address public owner;
    mapping(address => string) public ownerName;

    constructor() {
        owner = msg.sender;
    }

    // constructor() payable {
    //     owner = payable(msg.sender);
    // }

    function getOwner() public view returns (address) {
        return owner;
    }

    function createYourname(string memory _name) public {
        ownerName[msg.sender] = string(abi.encodePacked(_name));
    }

    function getName() public view returns (string memory yourname) {
        yourname = ownerName[msg.sender];
    }
}
