// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "openzeppelin-contracts/utils/introspection/IERC165.sol";
import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/token/ERC721/IERC721.sol";
import "openzeppelin-contracts/interfaces/IERC1271.sol";
import "openzeppelin-contracts/utils/cryptography/SignatureChecker.sol";
import "openzeppelin-contracts/utils/Strings.sol";

import "../../interfaces/IERC6551Account.sol";
import "../../lib/ERC6551AccountLib.sol";

contract SimpleERC6551Account is IERC165, IERC1271, IERC6551Account {
    uint256 public nonce;

    event WithdrawTokenLog(address indexed tokenAddress, address indexed to, uint256 amount);

    // Defining structure
    event RewardLog(string org, string repo, uint16 id, uint16 commentCount, uint16 commitCount, address tokenAddress, uint256 rewardAmount);

    mapping (string => uint16) _commitCounter;
    mapping (string => uint16) _commentCounter;
    mapping (address => uint256) _reward;

    receive() external payable {}

    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(msg.sender == owner(), "Not token owner");

        ++nonce;

        emit TransactionExecuted(to, value, data);

        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function withdrawToken(address tokenAddress, address to, uint256 amount) 
    external payable returns (bool) {
        require(msg.sender == owner(), "Not token owner");

        emit WithdrawTokenLog(tokenAddress, to, amount);

        return IERC20(tokenAddress).transferFrom(owner(), to, amount);
    }

    function logReward(
        string memory org, string memory repo, 
        uint16 id, address tokenAddress, 
        uint16 commentCount, uint16 commitCount, 
        uint256 rewardAmount)
    external {
        string memory issueId = string.concat(org, ':', repo, ':', Strings.toString(id));
        emit RewardLog(org, repo, id, commentCount, commitCount, tokenAddress, rewardAmount);
        _reward[tokenAddress] += rewardAmount;
        _commentCounter[issueId] += commentCount;
        _commitCounter[issueId] += commitCount;
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

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId);
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }
}
