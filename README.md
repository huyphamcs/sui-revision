# Sui Revision - Review Sui Move Knowledge and Exercises

This repository serves as a comprehensive guide to learning and practicing Sui Move smart contract development. It contains six progressive tasks that cover fundamental to advanced concepts in Sui blockchain development.

## Repository Information

- **Creator:** Tommy
- **Task ID:** [Lark Task](https://applink.larksuite.com/client/todo/detail?guid=482c11c7-bdbd-42a0-97f4-bdd87e44d315&suite_entity_num=t100052)
- **Template Repository:** [Let's Move](https://github.com/FirstMoversVietnam/lets-move/tree/main/task)
- **Repository:** [https://github.com/huyphamcs/sui-revision.git](https://github.com/huyphamcs/sui-revision.git)
- **Network:** Sui Testnet

## Addresses

- **Contract Deployment Address:** `0x18f98e22eb8da55a01b75c39542bb5bc35e33ff1bd9d9df30c04b77ec5df57b6`
- **User Interaction Address:** `0xbbad2c33857a81e3b7edf170f8b6dc2aac2476afc78e4bed9bbd1587befe1c22`

## Tasks Overview

### [Task 1: Hello World](./task-1)
Introduction to Sui development environment setup, CLI installation, wallet configuration, and deploying your first smart contract.

**Key Concepts:**
- Sui CLI installation and setup
- Wallet installation and management
- Basic smart contract deployment
- Object creation and transfer

### [Task 2: Tokens](./task-2)
Learn how to create custom tokens on Sui blockchain with different permission models.

**Key Concepts:**
- Token creation with owner-only minting (my_coin)
- Public faucet token creation (faucet_coin)
- Treasury cap management
- Token minting and distribution

### [Task 3: Move NFT](./task-3)
Build and deploy an NFT minting contract that allows creating custom NFTs with messages.

**Key Concepts:**
- NFT struct definition
- Custom metadata and properties
- NFT minting and transfer
- Object ownership

### [Task 4: Move Game](./task-4)
Implement a number guessing game with deposit, play, and withdrawal functionality.

**Key Concepts:**
- Game logic implementation
- Shared objects
- Admin capabilities
- Pool management
- User interactions

### [Task 5: Move Swap](./task-5)
Create a basic decentralized exchange (DEX) for swapping between two custom tokens.

**Key Concepts:**
- Liquidity pool implementation
- Token swapping logic
- Multi-token handling
- DEX mechanics

### [Task 6: Sui dApp](./task-6)
Build a full-stack decentralized application with a React frontend and Counter smart contract.

**Key Concepts:**
- Frontend integration with @mysten/dapp-kit
- Wallet connection
- Contract interaction from UI
- Shared object management
- Access control (owner vs public functions)

## Prerequisites

- Node.js and pnpm
- Sui CLI (installed via suiup)
- A Sui wallet (e.g., Slush wallet)
- Basic understanding of Rust and Move language

## Getting Started

### 1. Install Sui CLI

```bash
# Install suiup
curl -sSfL \
  https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh \
  | sh

# Install Sui CLI
suiup install sui@testnet

# Verify installation
sui --version
```

### 2. Set Up Wallet

Install a Sui wallet browser extension (e.g., [Slush Wallet](https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil))

### 3. Import Wallet to CLI

```bash
sui keytool import <YOUR_SEED_PHRASE> ed25519 --alias <YOUR_ADDRESS_NAME>
sui client switch --address <YOUR_ADDRESS>
```

### 4. Check Balance

```bash
sui client balance
```

## Building and Deploying Contracts

### Build a Contract

```bash
cd task-X/<contract-directory>
sui move build
```

### Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

### Interact with Deployed Contract

```bash
sui client call --package <PACKAGE_ID> \
  --module <MODULE_NAME> \
  --function <FUNCTION_NAME> \
  --args <ARGUMENTS>
```

## Project Structure

```
sui-revision/
├── task-1/          # Hello World
├── task-2/          # Token Creation
├── task-3/          # NFT Minting
├── task-4/          # Game Contract
├── task-5/          # DEX/Swap
├── task-6/          # Full-stack dApp
└── README.md        # This file
```

## Learning Path

1. Start with **Task 1** to set up your environment and understand basic deployments
2. Progress through **Tasks 2-3** to learn about tokens and NFTs
3. Tackle **Tasks 4-5** to understand complex contract interactions and DeFi concepts
4. Complete **Task 6** to integrate everything into a full-stack application

## Resources

- [Sui Documentation](https://docs.sui.io/)
- [Sui Move Book](https://move-book.com/)
- [Sui SDK](https://sdk.mystenlabs.com/)
- [Sui Testnet Explorer](https://testnet.suivision.xyz/)

## Contributing

This is a learning repository. Feel free to explore, experiment, and learn from the code!

## License

Educational purposes only.
