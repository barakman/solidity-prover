// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import "../Prover.sol";

contract TestProver is Prover {
    function appendOne(uint256[] calldata array, uint256 value) external {
        authenticate(array);
        appendAndUpdate(array, value);
    }

    function removeOne(uint256[] calldata array, uint256 index) external {
        authenticate(array);
        removeAndUpdate(array, index);
    }

    function updateAll(uint256[] calldata array, uint256 delta) external {
        authenticate(array);
        uint256[] memory newArray = new uint256[](array.length);
        for (uint256 i = 0; i < array.length; i++)
            newArray[i] = array[i] + delta;
        generalUpdate(newArray);
    }
}
