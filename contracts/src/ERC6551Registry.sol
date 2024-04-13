// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "openzeppelin-contracts/utils/Create2.sol";

import "./interfaces/IERC6551Registry.sol";
import "./lib/ERC6551BytecodeLib.sol";
import "./lib/ERC6551AccountLib.sol";

import "openzeppelin-contracts/utils/introspection/IERC165.sol";
import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/token/ERC721/IERC721.sol";
import "openzeppelin-contracts/interfaces/IERC1271.sol";
import "openzeppelin-contracts/utils/cryptography/SignatureChecker.sol";
import "openzeppelin-contracts/utils/Strings.sol";

contract ERC6551Registry is IERC6551Registry {
    
    mapping (address => string) _githubIdByAddress;
    mapping (string => address) _addressMapping;

    error InitializationFailed();

    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external returns (address) {
        bytes memory code = ERC6551BytecodeLib.getCreationCode(
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        address _account = Create2.computeAddress(bytes32(salt), keccak256(code));

        if (_account.code.length != 0) return _account;

        emit AccountCreated(_account, implementation, chainId, tokenContract, tokenId, salt);

        _account = Create2.deploy(0, bytes32(salt), code);

        if (initData.length != 0) {
            (bool success, ) = _account.call(initData);
            if (!success) revert InitializationFailed();
        }

        return _account;
    }

    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address) {
        bytes32 bytecodeHash = keccak256(
            ERC6551BytecodeLib.getCreationCode(
                implementation,
                chainId,
                tokenContract,
                tokenId,
                salt
            )
        );

        return Create2.computeAddress(bytes32(salt), bytecodeHash);
    }

    function token()
        external
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        return ERC6551AccountLib.token();
    }

    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function registerGithubId(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        string memory githubId
    ) external returns (address) {
        
        require(msg.sender == owner(), "Not token owner");

        bytes32 bytecodeHash = keccak256(
            ERC6551BytecodeLib.getCreationCode(
                implementation,
                chainId,
                tokenContract,
                tokenId,
                salt
            )
        );

        address _address = Create2.computeAddress(bytes32(salt), bytecodeHash);
        // TODO: already registered mapping check;
        // TODO: change githubId scenario
        _githubIdByAddress[_address] = githubId;
        _addressMapping[githubId] = _address;

        return _address;
    }
    
    function accountAndGithubId(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address, string memory) {
        bytes32 bytecodeHash = keccak256(
            ERC6551BytecodeLib.getCreationCode(
                implementation,
                chainId,
                tokenContract,
                tokenId,
                salt
            )
        );

        address _address = Create2.computeAddress(bytes32(salt), bytecodeHash);
        string memory _githubId = _githubIdByAddress[_address];
        return (_address, _githubId);
    }

    function githubIdAndAccount(
        string memory githubId
    ) external view returns (address) {
        address _address = _addressMapping[githubId];
        return _address;
    }
}
