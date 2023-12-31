// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.21;

contract Target {

    uint256 public number;
    address public owner;
    
    constructor(address _owner) {
        owner = _owner;
    }

    function setNumber(uint256 _number) public {
        require(msg.sender == owner, "You are not owner");
        number = _number;
    }
}