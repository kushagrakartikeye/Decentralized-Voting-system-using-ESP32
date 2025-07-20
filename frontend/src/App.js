import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x79846Ce1a66e2288051Eb9D51045cA9Ab14C4eF0";

// Complete ABI for your contract
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_tagID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_buttonNumber",
				"type": "uint256"
			}
		],
		"name": "castVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pickWinner",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "winningButton",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "highestVotes",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_tagID",
				"type": "string"
			}
		],
		"name": "resetVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "tagID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "buttonNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "winningButton",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			}
		],
		"name": "WinnerDeclared",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "buttonVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getVote",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"internalType": "string",
				"name": "tagID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "buttonNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [networkName, setNetworkName] = useState("");

  const [voteCount, setVoteCount] = useState(0);
  const [votes, setVotes] = useState([]);
  const [buttonVotes, setButtonVotes] = useState({});
  
  const [tagID, setTagID] = useState("");
  const [buttonNumber, setButtonNumber] = useState("");
  const [status, setStatus] = useState("Welcome to RFID Voting DApp! Connect your wallet to get started.");
  const [loading, setLoading] = useState(false);
  
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState("");
  const [winner, setWinner] = useState(null);
  const [resetTag, setResetTag] = useState("");
  const [newOwner, setNewOwner] = useState("");
  
  const [queryTagID, setQueryTagID] = useState("");
  const [queryButtonNumber, setQueryButtonNumber] = useState("");
  const [queryResult, setQueryResult] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("❌ Please install MetaMask to use this app.");
      return;
    }

    try {
      setLoading(true);
      setStatus("🔗 Connecting to wallet...");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setNetworkName(network.name || `Chain ${network.chainId}`);

      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        setStatus("❌ Contract not found at this address. Please check the contract address and network.");
        return;
      }

      // Initialize contract
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(contractInstance);
      
      try {
        // Get owner
        const contractOwner = await contractInstance.owner();
        setOwner(contractOwner);
        setIsOwner(contractOwner.toLowerCase() === address.toLowerCase());
        
        setStatus("✅ Wallet connected successfully!");
        
        // Load initial data
        await loadVotingData(contractInstance);
        
      } catch (contractError) {
        setStatus("❌ Failed to connect to contract: " + contractError.message);
        console.error("Contract connection error:", contractError);
      }
      
    } catch (error) {
      setStatus("❌ Failed to connect wallet: " + error.message);
      console.error("Wallet connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount("");
    setContract(null);
    setNetworkName("");
    setIsOwner(false);
    setOwner("");
    setVoteCount(0);
    setVotes([]);
    setButtonVotes({});
    setWinner(null);
    setStatus("Wallet disconnected. Connect again to use the app.");
  };

  // Load all voting data
  const loadVotingData = async (contractInstance = contract) => {
    if (!contractInstance) return;
    
    try {
      setLoading(true);
      setStatus("📊 Loading voting data...");
      
      // Get total vote count
      const count = await contractInstance.getVoteCount();
      const totalVotes = Number(count);
      setVoteCount(totalVotes);
      
      // Get all votes
      const allVotes = [];
      const buttonVotesMap = {};
      
      for (let i = 0; i < totalVotes; i++) {
        try {
          const [tagID, buttonNumber, timestamp] = await contractInstance.getVote(i);
          const vote = {
            index: i,
            tagID,
            buttonNumber: Number(buttonNumber),
            timestamp: Number(timestamp)
          };
          allVotes.push(vote);
          
          const btnNum = Number(buttonNumber);
          buttonVotesMap[btnNum] = (buttonVotesMap[btnNum] || 0) + 1;
        } catch (voteError) {
          console.error(`Error loading vote ${i}:`, voteError);
        }
      }
      
      setVotes(allVotes);
      setButtonVotes(buttonVotesMap);
      
      if (totalVotes > 0) {
        setStatus(`📈 Loaded ${totalVotes} votes successfully!`);
      } else {
        setStatus("📊 No votes cast yet. Be the first to vote!");
      }
      
    } catch (error) {
      console.error("Error loading voting data:", error);
      setStatus("❌ Error loading voting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cast a vote
  const castVote = async (e) => {
    e.preventDefault();
    if (!contract || !tagID || !buttonNumber) {
      setStatus("❌ Please enter both tag ID and button number.");
      return;
    }

    try {
      setLoading(true);
      setStatus("🔍 Checking if tag has already voted...");
      
      const hasVoted = await contract.hasVoted(tagID);
      if (hasVoted) {
        setStatus("❌ This tag has already voted!");
        return;
      }
      
      setStatus("📝 Submitting vote to blockchain...");
      const tx = await contract.castVote(tagID, buttonNumber);
      
      setStatus("⏳ Waiting for transaction confirmation...");
      await tx.wait();
      
      setStatus("✅ Vote cast successfully!");
      setTagID("");
      setButtonNumber("");
      
      // Reload data
      setTimeout(() => loadVotingData(), 1000);
      
    } catch (error) {
      console.error("Vote error:", error);
      setStatus("❌ Vote failed: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Pick winner (owner only)
  const pickWinner = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setStatus("🏆 Determining winner...");
      
      const tx = await contract.pickWinner();
      setStatus("⏳ Waiting for confirmation...");
      const receipt = await tx.wait();
      
      // Parse the WinnerDeclared event from receipt
      const winnerEvent = receipt.logs.find(log => {
        try {
          const decoded = contract.interface.parseLog(log);
          return decoded.name === 'WinnerDeclared';
        } catch {
          return false;
        }
      });
      
      if (winnerEvent) {
        const decoded = contract.interface.parseLog(winnerEvent);
        const winnerData = {
          winningButton: Number(decoded.args.winningButton),
          votes: Number(decoded.args.votes)
        };
        setWinner(winnerData);
        setStatus(`🎉 Winner declared! Button ${winnerData.winningButton} wins with ${winnerData.votes} votes!`);
      } else {
        setStatus("✅ Winner picking completed!");
      }
      
    } catch (error) {
      console.error("Pick winner error:", error);
      setStatus("❌ Failed to pick winner: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Reset vote (owner only)
  const resetVote = async (e) => {
    e.preventDefault();
    if (!contract || !resetTag) {
      setStatus("❌ Please enter a tag ID to reset.");
      return;
    }
    
    try {
      setLoading(true);
      setStatus("🔄 Resetting vote for tag...");
      
      const tx = await contract.resetVote(resetTag);
      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      
      setStatus(`✅ Vote reset successfully for tag: ${resetTag}`);
      setResetTag("");
      
      // Reload data
      setTimeout(() => loadVotingData(), 1000);
      
    } catch (error) {
      console.error("Reset vote error:", error);
      setStatus("❌ Failed to reset vote: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const transferOwnership = async (e) => {
    e.preventDefault();
    if (!contract || !newOwner) {
      setStatus("❌ Please enter a valid address.");
      return;
    }
    
    try {
      setLoading(true);
      setStatus("👑 Transferring ownership...");
      
      const tx = await contract.transferOwnership(newOwner);
      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      
      setStatus(`✅ Ownership transferred to: ${newOwner}`);
      setNewOwner("");
      setIsOwner(false);
      setOwner(newOwner);
      
    } catch (error) {
      console.error("Transfer ownership error:", error);
      setStatus("❌ Failed to transfer ownership: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const queryTagVoted = async () => {
    if (!contract || !queryTagID) {
      setQueryResult("❌ Please enter a tag ID to query.");
      return;
    }
    
    try {
      setLoading(true);
      const hasVoted = await contract.hasVoted(queryTagID);
      setQueryResult(`Tag "${queryTagID}" has ${hasVoted ? '✅ already voted' : '❌ not voted yet'}`);
    } catch (error) {
      setQueryResult("❌ Error querying tag: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const queryButtonVotes = async () => {
    if (!contract || !queryButtonNumber) {
      setQueryResult("❌ Please enter a button number to query.");
      return;
    }
    
    try {
      setLoading(true);
      const votes = await contract.buttonVotes(queryButtonNumber);
      setQueryResult(`Button ${queryButtonNumber} has ${Number(votes)} votes`);
    } catch (error) {
      setQueryResult("❌ Error querying button: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLeader = () => {
    if (Object.keys(buttonVotes).length === 0) {
      setStatus("📊 No votes cast yet.");
      return;
    }

    let maxVotes = 0;
    let leadingButton = 0;

    Object.entries(buttonVotes).forEach(([button, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        leadingButton = parseInt(button);
      }
    });

    if (maxVotes > 0) {
      setStatus(`📊 Current leader: Button ${leadingButton} with ${maxVotes} votes`);
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (contract) {
      const handleVoteCast = (tagID, buttonNumber, timestamp) => {
        console.log("Vote cast event:", tagID, buttonNumber, timestamp);
        setTimeout(() => loadVotingData(), 2000); // Delay to ensure blockchain update
      };
      
      const handleWinnerDeclared = (winningButton, votes) => {
        console.log("Winner declared event:", winningButton, votes);
        setWinner({
          winningButton: Number(winningButton),
          votes: Number(votes)
        });
      };
      
      contract.on("VoteCast", handleVoteCast);
      contract.on("WinnerDeclared", handleWinnerDeclared);
      
      return () => {
        contract.removeAllListeners("VoteCast");
        contract.removeAllListeners("WinnerDeclared");
      };
    }
  }, [contract]);

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <h1>🏷️ RFID Voting DApp</h1>
        <p>Secure blockchain voting using RFID tags</p>
      </header>

      {/* Wallet Connection */}
      <section className="wallet-section">
        {!account ? (
          <div className="connect-wallet">
            <button onClick={connectWallet} disabled={loading} className="connect-btn">
              {loading ? "🔄 Connecting..." : "🔗 Connect Wallet"}
            </button>
            <p className="wallet-info">Connect your MetaMask wallet to start voting</p>
          </div>
        ) : (
          <div className="wallet-info">
            <div className="account-info">
              <div className="account-details">
                <strong>🔗 Connected Account:</strong> 
                <span className="address">{account}</span>
                {isOwner && <span className="owner-badge">👑 CONTRACT OWNER</span>}
              </div>
              <div className="network-info">
                <strong>🌐 Network:</strong> {networkName}
              </div>
              <div className="contract-info">
                <strong>📄 Contract:</strong> 
                <a href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                  {CONTRACT_ADDRESS}
                </a>
              </div>
              <button onClick={disconnectWallet} className="disconnect-btn">
                Disconnect
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Status */}
      <section className="status-section">
        <div className={`status-message ${
          status.includes('✅') ? 'success' : 
          status.includes('❌') ? 'error' : 
          'info'
        }`}>
          {status}
        </div>
        {loading && <div className="loading-spinner">🔄 Processing...</div>}
      </section>

      {contract && (
        <>
          {/* Vote Casting */}
          <section className="vote-section">
            <h2>🗳️ Cast Your Vote</h2>
            <form onSubmit={castVote} className="vote-form">
              <div className="form-group">
                <label>RFID Tag ID:</label>
                <input
                  type="text"
                  placeholder="Enter your RFID Tag ID (e.g., TAG001)"
                  value={tagID}
                  onChange={(e) => setTagID(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Button Number:</label>
                <input
                  type="number"
                  placeholder="Enter button number (1, 2, 3, etc.)"
                  value={buttonNumber}
                  onChange={(e) => setButtonNumber(e.target.value)}
                  min="1"
                  max="100"
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" disabled={loading || !tagID || !buttonNumber} className="vote-btn">
                {loading ? "🔄 Casting Vote..." : "🗳️ Cast Vote"}
              </button>
            </form>
          </section>

          {/* Voting Results */}
          <section className="results-section">
            <h2>📊 Voting Results</h2>
            <div className="stats-header">
              <button onClick={() => loadVotingData()} disabled={loading} className="refresh-btn">
                {loading ? "🔄 Loading..." : "🔄 Refresh Data"}
              </button>
              <button onClick={getCurrentLeader} disabled={loading} className="leader-btn">
                📊 Show Current Leader
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Votes</h3>
                <div className="stat-number">{voteCount}</div>
              </div>
              <div className="stat-card">
                <h3>Active Buttons</h3>
                <div className="stat-number">{Object.keys(buttonVotes).length}</div>
              </div>
              <div className="stat-card">
                <h3>Contract Owner</h3>
                <div className="stat-address">{owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : 'Loading...'}</div>
              </div>
              {winner && (
                <div className="stat-card winner-card">
                  <h3>🏆 Official Winner</h3>
                  <div className="stat-number">Button {winner.winningButton}</div>
                  <div className="stat-detail">{winner.votes} votes</div>
                </div>
              )}
            </div>

            {/* Button Votes Breakdown */}
            {Object.keys(buttonVotes).length > 0 && (
              <div className="button-votes">
                <h3>📊 Votes by Button</h3>
                <div className="button-grid">
                  {Object.entries(buttonVotes)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([button, count]) => (
                      <div key={button} className="button-card">
                        <div className="button-number">Button {button}</div>
                        <div className="button-votes-count">{count} votes</div>
                        <div className="vote-percentage">
                          {voteCount > 0 ? ((count / voteCount) * 100).toFixed(1) : 0}%
                        </div>
                        <div className="vote-bar">
                          <div 
                            className="vote-bar-fill"
                            style={{
                              width: `${voteCount > 0 ? (count / voteCount) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>

          {/* All Votes Table */}
          <section className="votes-table-section">
            <h2>📋 All Votes History</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tag ID</th>
                    <th>Button</th>
                    <th>Timestamp</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {votes.length > 0 ? (
                    votes.map((vote, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="tag-id">{vote.tagID}</td>
                        <td className="button-number">Button {vote.buttonNumber}</td>
                        <td>{vote.timestamp}</td>
                        <td>{new Date(vote.timestamp * 1000).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">No votes cast yet. Be the first to vote!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Query Functions */}
          <section className="query-section">
            <h2>🔍 Query Functions</h2>
            <div className="query-grid">
              <div className="query-card">
                <h3>🏷️ Check if Tag Voted</h3>
                <div className="query-form">
                  <input
                    type="text"
                    placeholder="Enter Tag ID"
                    value={queryTagID}
                    onChange={(e) => setQueryTagID(e.target.value)}
                  />
                  <button onClick={queryTagVoted} disabled={loading}>
                    🔍 Query Tag
                  </button>
                </div>
              </div>
              
              <div className="query-card">
                <h3>🔢 Check Button Votes</h3>
                <div className="query-form">
                  <input
                    type="number"
                    placeholder="Button Number"
                    value={queryButtonNumber}
                    onChange={(e) => setQueryButtonNumber(e.target.value)}
                    min="1"
                  />
                  <button onClick={queryButtonVotes} disabled={loading}>
                    🔍 Query Button
                  </button>
                </div>
              </div>
            </div>
            
            {queryResult && (
              <div className="query-result">
                <strong>Query Result:</strong> {queryResult}
              </div>
            )}
          </section>

          {/* Owner Functions */}
          {isOwner && (
            <section className="owner-section">
              <h2>👑 Owner Functions</h2>
              <div className="owner-notice">
                <p>⚠️ You are the contract owner. Use these functions carefully!</p>
              </div>
              
              <div className="owner-grid">
                <div className="owner-card">
                  <h3>🏆 Pick Winner</h3>
                  <p>Declare the winning button based on vote count</p>
                  <button 
                    onClick={pickWinner} 
                    disabled={loading || voteCount === 0}
                    className="winner-btn"
                  >
                    {loading ? "🔄 Picking..." : "🏆 Pick Winner"}
                  </button>
                  {voteCount === 0 && <small>⚠️ Need at least 1 vote to pick winner</small>}
                </div>

                <div className="owner-card">
                  <h3>🔄 Reset Tag Vote</h3>
                  <p>Allow a tag to vote again</p>
                  <form onSubmit={resetVote}>
                    <input
                      type="text"
                      placeholder="Tag ID to reset (e.g., TAG001)"
                      value={resetTag}
                      onChange={(e) => setResetTag(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={loading} className="reset-btn">
                      {loading ? "🔄 Resetting..." : "🔄 Reset Vote"}
                    </button>
                  </form>
                </div>

                <div className="owner-card">
                  <h3>👑 Transfer Ownership</h3>
                  <p>Transfer contract ownership to another address</p>
                  <form onSubmit={transferOwnership}>
                    <input
                      type="text"
                      placeholder="New owner address (0x...)"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={loading} className="transfer-btn">
                      {loading ? "🔄 Transferring..." : "👑 Transfer Ownership"}
                    </button>
                  </form>
                </div>

                <div className="owner-card">
                  <h3>🔄 Refresh Data</h3>
                  <p>Reload all voting data from blockchain</p>
                  <button 
                    onClick={() => loadVotingData()} 
                    disabled={loading}
                    className="refresh-btn"
                  >
                    {loading ? "🔄 Loading..." : "🔄 Refresh Data"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="contract-info">
            <h4>📄 Contract Information</h4>
            <p>
              <strong>Address:</strong> 
              <a 
                href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contract-link"
              >
                {CONTRACT_ADDRESS}
              </a>
            </p>
            <p><strong>Network:</strong> {networkName || 'Not connected'}</p>
          </div>
          <div className="footer-text">
            <p>🔐 Built with React & ethers.js | Secured by blockchain technology</p>
            <p>⚡ Real-time updates | 🛡️ Reentrancy protected | 👑 Owner controlled</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
