// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

abstract contract Prover {
    bytes32 private _hash = keccak256(abi.encodePacked());

    event Updated(bytes state);

    function authenticate(uint256[] calldata array) internal view returns (bool) {
        return keccak256(abi.encodePacked(array)) == _hash;
    }

    function generalUpdate(uint256[] memory array) internal {
        _update(abi.encodePacked(array));
    }

    function appendAndUpdate(uint256[] calldata array, uint256 value) internal {
        _update(abi.encodePacked(array, value));
    }

    function removeAndUpdate(uint256[] calldata array, uint256 index) internal {
        if (array.length == 1)
            _update(abi.encodePacked());
        else if (array.length == index + 1)
            _update(abi.encodePacked(array[:index]));
        else
            _update(abi.encodePacked(array[:index], array[index + 1 : array.length - 1], array[array.length - 1]));
    }

    function _update(bytes memory state) private {
        _hash = keccak256(state);
        emit Updated(state);
    }
}
