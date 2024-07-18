// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    string public title;
    string public option1;
    string public option2;
    uint256 public votesOption1;
    uint256 public votesOption2;
    mapping(address => bool) public hasVoted;
    bool public votingClosed;
    event VotingClosed();

    event Voted(address indexed voter, string option);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    modifier votingIsOpen() {
        require(!votingClosed, "Voting is closed");
        _;
    }

    constructor(string memory _title, string memory _option1, string memory _option2) {
        owner = msg.sender;
        title = _title;
        option1 = _option1;
        option2 = _option2;
    }

    function vote(string memory option) public hasNotVoted votingIsOpen {
        require(keccak256(abi.encodePacked(option)) == keccak256(abi.encodePacked(option1)) || 
                keccak256(abi.encodePacked(option)) == keccak256(abi.encodePacked(option2)), 
                "Invalid option");

        hasVoted[msg.sender] = true;

        if (keccak256(abi.encodePacked(option)) == keccak256(abi.encodePacked(option1))) {
            votesOption1++;
        } else {
            votesOption2++;
        }

        emit Voted(msg.sender, option);
    }

    function getVotes() public view returns (uint256, uint256) {
        return (votesOption1, votesOption2);
    }
    
    function closeVoting() public onlyOwner {
        votingClosed = true;
        emit VotingClosed();
    }
}
