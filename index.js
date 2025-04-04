import express from "express";
import { Alchemy, Wallet, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();
console.log("Loaded ENV:", process.env);

// Read contract ABI
const abi = JSON.parse(fs.readFileSync("./abi.json", "utf8"));

const app = express();
app.use(express.json());

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

// Initialize Alchemy and Provider
const alchemy = new Alchemy(config);
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

// Create Wallet and Contract Instance
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, wallet);

app.post("/vote", async (req, res) => {
  try {
    const { tagId, buttonId } = req.body; // Fix request parameter names
    if (!tagId || !buttonId) {
      return res.status(400).json({ success: false, error: "Missing parameters" });
    }

    console.log(`Received vote: Tag - ${tagId}, Button - ${buttonId}`);

    // Send vote to smart contract
    console.log(`Sending transaction to blockchain...`);
    const tx = await contract.castVote(tagId, buttonId);
    console.log("Transaction sent! Waiting for confirmation...");
    await tx.wait();

    console.log(`✅ Vote recorded on blockchain: ${tx.hash}`);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error(`❌ Blockchain transaction failed: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
