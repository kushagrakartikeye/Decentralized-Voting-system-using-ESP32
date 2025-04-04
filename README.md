# Decentralized Voting System with RFID and ESP32

## Overview
This project is a decentralized voting system that integrates an RFID module, four buttons, and an ESP32 microcontroller. The system ensures secure and autonomous vote registration on the Ethereum blockchain through a Node.js backend. The entire transaction process is automated, allowing votes to be tracked on Etherscan or queried via smart contract functions.

## Features
- **RFID Authentication:** Each RFID tag can be used only once per voting cycle.
- **Button-Based Voting:** The system supports four distinct voting options, each represented by a button.
- **ESP32 Integration:** Handles RFID scanning and button inputs, communicating with the backend server.
- **Node.js Backend:** Manages Ethereum transaction signing and submission.
- **Smart Contract on Ethereum:** Stores votes securely on the blockchain.
- **Blockchain Transparency:** Votes can be tracked via Etherscan or retrieved through the smart contract.
- **Tamper-Proof:** Since the voting records are on the blockchain, they cannot be altered or deleted.
- **Decentralization:** No single entity controls the voting process, ensuring fairness and trust.

## System Architecture
```mermaid
graph TD;
    A[RFID Module] -->|Scan Unique Tag| B(ESP32)
    B -->|Valid Tag Detected| C[Allow Button Press]
    C -->|Button Pressed| D[Vote Registered]
    D -->|Send Data| E[Node.js Backend]
    E -->|Sign Transaction| F[Ethereum Smart Contract]
    F -->|Store Vote| G[Ethereum Blockchain]
    G -->|Track via Etherscan| H[User]
    G -->|Query via Smart Contract| I[Admin]
```

## Hardware Requirements
- ESP32 Dev Module
- RFID Module (e.g., MFRC522)
- RFID Tags
- 4 Push Buttons
- LED Indicator (optional)
- Power Supply

## Software Requirements
- Arduino IDE (for ESP32 programming)
- Node.js & npm
- Hardhat or Remix (for smart contract deployment)
- Alchemy API (for blockchain interactions)
- MetaMask Wallet

## Installation and Setup
### 1. Flashing the ESP32
1. Connect the ESP32 to your computer via USB.
2. Open the Arduino IDE and install the required libraries:
   - `MFRC522` for RFID
   - `WiFi` for network connectivity
   - `HTTPClient` for sending data to the backend
3. Upload the `ESP32_RFID_Voting.ino` sketch to the ESP32.

### 2. Setting Up the Backend
1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/decentralized-voting
   cd decentralized-voting
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure `.env` file with Alchemy API key and wallet details.
4. Start the server:
   ```sh
   node server.js
   ```

### 3. Deploying the Smart Contract
1. Navigate to the `smart-contract` folder.
2. Compile and deploy the contract using Hardhat:
   ```sh
   npx hardhat run scripts/deploy.js --network sepolia
   ```
3. Copy the deployed contract address and update the backend configuration.

## Usage
1. Scan an RFID tag to authenticate.
2. Press one of the four voting buttons.
3. The vote is signed and submitted automatically to the Ethereum blockchain.
4. Verify the transaction on Etherscan or interact with the contract directly.

## Tracking Votes
- **Etherscan:** Search for transactions using the smart contract address.
- **Smart Contract Call:** Use `getVoteCount()` to retrieve vote counts.

## Security Measures
- **RFID Tag Uniqueness:** Each tag can be used only once per voting cycle to prevent duplicate votes.
- **Encrypted Transactions:** Transactions are signed and encrypted using Ethereum cryptographic protocols.
- **Tamper-Proof Records:** Blockchain ensures that once a vote is stored, it cannot be altered.
- **Private Key Security:** Private keys are stored securely on the backend and never exposed.

## Use Case Scenarios
### Scenario 1: University Elections
A university conducts student body elections using this system. Each student is assigned an RFID tag linked to their student ID. They scan their tag and press their preferred candidate’s button. The vote is instantly recorded on Ethereum and can be verified on Etherscan.

### Scenario 2: Corporate Board Elections
A company uses the system to conduct board member elections. RFID tags are issued to board members, and votes are cast electronically. This eliminates ballot tampering and ensures transparency.

### Scenario 3: Community Polls
A community uses the system to decide on local matters. Residents receive RFID tags, and their votes are registered securely on the blockchain.

## Troubleshooting
### Problem: ESP32 is not detecting RFID tags
**Solution:**
- Ensure the RFID module is correctly wired to the ESP32.
- Check the power supply (RFID modules require 3.3V or 5V depending on the model).
- Verify that the MFRC522 library is installed and correctly initialized.

### Problem: No transaction appears on Etherscan
**Solution:**
- Confirm that the backend server is running and correctly configured.
- Check that the Ethereum wallet has enough gas for transactions.
- Ensure the smart contract address is correctly updated in the backend.

### Problem: Port busy error when uploading to ESP32
**Solution:**
- Close any programs using the serial port (e.g., Arduino Serial Monitor, Processing IDE).
- Restart the computer and try again.

## Future Improvements
- **Web Dashboard:** Create a UI for real-time vote tracking and results visualization.
- **Mobile App Integration:** Allow users to authenticate using a mobile app instead of RFID tags.
- **Multi-Smart Contract Support:** Enable elections for different organizations with independent contract instances.
- **Layer 2 Integration:** Implement Optimistic Rollups or zk-Rollups to reduce Ethereum gas fees.
- **Decentralized Storage:** Use IPFS for additional voting record storage.

## License
This project is licensed under the MIT License.

## Contributing
Pull requests are welcome! Feel free to improve the project and submit changes.

## Acknowledgments
- Ethereum documentation for blockchain interactions.
- Hardhat for simplifying smart contract deployment.
- Community contributions for improving transparency in voting systems.

