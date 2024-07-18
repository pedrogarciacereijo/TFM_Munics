// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oraculo {
    // IPFS //

    event IPFS_Add_Event(address indexed _sender, string cipher);
    function trigger_IPFS_Add_Event( string memory _cipher) external {
        // Emitir el evento
        emit IPFS_Add_Event(msg.sender, _cipher);
    }

    event IPFS_Cat_Event(address indexed _sender);
    function trigger_IPFS_Cat_Event() external {
        emit IPFS_Cat_Event(msg.sender);
    }

    mapping(string => string) private userToCipher;
    function setValuesIPFS(string memory _userAddress, string memory _cipher) public {
        userToCipher[_userAddress] = _cipher;
    }

    function getValuesIPFS(string memory _userAddress) public view returns (string memory) {
        return userToCipher[_userAddress];
    }
} 