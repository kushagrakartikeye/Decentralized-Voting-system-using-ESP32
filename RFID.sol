// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

//deployed at 0x79846Ce1a66e2288051Eb9D51045cA9Ab14C4eF0

contract RFIDVoting is ReentrancyGuard, Ownable {
    struct Vote {
        string tagID;
        uint256 buttonNumber;
        uint256 timestamp;
    }

    Vote[] public votes;
    mapping(string => bool) public hasVoted;
    mapping(uint256 => uint256) public buttonVotes;
    
    event VoteCast(string tagID, uint256 buttonNumber, uint256 timestamp);
    event WinnerDeclared(uint256 winningButton, uint256 votes);

    constructor() Ownable(msg.sender) {}

    function castVote(string memory _tagID, uint256 _buttonNumber) public nonReentrant {
        require(!hasVoted[_tagID], "This tag has already voted.");

        votes.push(Vote(_tagID, _buttonNumber, block.timestamp));
        hasVoted[_tagID] = true;
        buttonVotes[_buttonNumber]++;

        emit VoteCast(_tagID, _buttonNumber, block.timestamp);
    }

    function getVoteCount() public view returns (uint256) {
        return votes.length;
    }

    function getVote(uint256 index) public view returns (string memory, uint256, uint256) {
        require(index < votes.length, "Invalid vote index.");
        Vote memory vote = votes[index];
        return (vote.tagID, vote.buttonNumber, vote.timestamp);
    }

    function pickWinner() public onlyOwner returns (uint256 winningButton, uint256 highestVotes) {
        require(votes.length > 0, "No votes have been cast yet.");
        
        uint256 maxVotes = 0;
        uint256 winningBtn;
        
        for (uint256 i = 0; i < votes.length; i++) {
            uint256 btn = votes[i].buttonNumber;
            if (buttonVotes[btn] > maxVotes) {
                maxVotes = buttonVotes[btn];
                winningBtn = btn;
            }
        }
        
        emit WinnerDeclared(winningBtn, maxVotes);
        return (winningBtn, maxVotes);
    }
    
    function resetVote(string memory _tagID) public onlyOwner {
        hasVoted[_tagID] = false;
    }
}
