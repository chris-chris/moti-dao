// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.17;

contract Encode {
    address _from = 0x55C21585007bC89202Bc7eed9B315c8eaB4190A8;
    address _to = 0xB1620c0547744DeDD30F40a863c09D1964532F8C;
    uint _id = 1;

    function encodeWithSignature() external view returns (bytes memory) {
        return abi.encodeWithSignature("safeTransferFrom(address,address,uint256)", _from, _to, _id);
    }
}