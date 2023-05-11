// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "../Prover.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestProver is Prover {
    IERC20 private immutable _token;

    constructor(IERC20 token) {
        _token = token;
    }

    function deposit(uint256[] calldata balances, uint256 value) external {
        authenticate(balances);
        _token.transferFrom(msg.sender, address(this), value);
        appendAndUpdate(balances, value);
    }

    function withdrawAll(uint256[] calldata balances, uint256 index) external {
        authenticate(balances);
        _token.transfer(msg.sender, balances[index]);
        removeAndUpdate(balances, index);
    }

    function withdrawSome(uint256[] calldata balances, uint256 index, uint256 value) external {
        authenticate(balances);
        _token.transfer(msg.sender, value);
        uint256[] memory newBalances = balances;
        newBalances[index] -= value;
        generalUpdate(newBalances);
    }
}
