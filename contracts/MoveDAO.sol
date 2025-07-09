// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MooveDAO is Ownable {

    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoise;
        
    }

    IERC20 public daoToken;
    bool public saleActive = true;
    uint256 public constant sharePrice = 10 * 1e18;
    Proposal[] public proposals;
    
    mapping(address => uint256) public shares;
    mapping(address => address) public delegation;
    mapping(address => address[]) public delegators;

    event SharesBought(address indexed buyer, uint256 amount); 
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
    daoToken = IERC20(_tokenAddress);
    }


    function buyShares(uint256 amount) external {
        require(saleActive, "The sale of shares has ended");
        uint256 cost = amount * sharePrice;
        
        require(daoToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");

        shares[msg.sender] += amount;

        emit SharesBought(msg.sender, amount);
    }
    
    function stopSale() external onlyOwner {
        saleActive = false;
    }

    function createProposal(string memory description) external {
        require(shares[msg.sender] > 0, "You must own shares to propose");

        proposals.push();
        uint256 proposalId = proposals.length - 1;
        proposals[proposalId].description = description;
    }


    function delegateVote(address delegatee) external {
        require(shares[msg.sender] > 0, "You must own shares to delegate");
        require(delegatee != msg.sender, "You can't delegate to yourself");

        delegation[msg.sender] = delegatee;
        delegators[delegatee].push(msg.sender);
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];

        require(!proposal.hasVoted[msg.sender], "You have already voted");

        uint256 votingPower = shares[msg.sender];

        address[] memory delegatorList = delegators[msg.sender];
        for (uint i = 0; i < delegatorList.length; i++) {
            address delegator = delegatorList[i];
            if (!proposal.hasVoted[delegator]) {
                votingPower += shares[delegator];
             }
        }

        require(votingPower > 0, "No voting power");

        if (support) {
            proposal.votesFor += votingPower;
            proposal.voteChoise[msg.sender] = true;
        } else {
            proposal.votesAgainst += votingPower;
            proposal.voteChoise[msg.sender] = false;
        }

        proposal.hasVoted[msg.sender] = true;
    }


    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];

    
        require(!proposal.executed, "Proposal already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal not approved");

        proposal.executed = true;
    }


    function getProposal(uint256 proposalId) external view returns (string memory, uint256, uint256, bool) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.description, proposal.votesFor, proposal.votesAgainst, proposal.executed);
    }

    function hasVotedFor(uint256 proposalId, address voter) external view returns (bool){
        Proposal storage proposal = proposals[proposalId];
        return proposal.hasVoted[voter] && proposal.voteChoise[voter] == true;
    }

    function hasVotedAgainst(uint256 proposalId, address voter) external view returns (bool){
        Proposal storage proposal = proposals[proposalId];
        return proposal.hasVoted[voter] && proposal.voteChoise[voter] == false;  
    }
}
