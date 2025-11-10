# Task 1: Hello World

## Overview

This task introduces the fundamentals of Sui blockchain development by setting up the development environment, installing necessary tools, and deploying your first smart contract - a simple "Hello World" contract that creates an object with a custom text message.

## Learning Objectives

- Install and configure Sui CLI
- Set up a Sui wallet
- Import wallet addresses to Sui CLI
- Build and deploy a Move smart contract
- Interact with deployed contracts
- Query on-chain objects

## Prerequisites

- Linux/macOS operating system
- Basic command line knowledge
- Internet connection for downloading tools

## Installation Steps

### 1. Install suiup

suiup is the version manager for Sui CLI:

```bash
curl -sSfL \
  https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh \
  | sh
```

Verify installation:

```bash
suiup --version
# Expected output: suiup 0.0.4
```

### 2. Install Sui CLI

Install the Sui CLI for testnet:

```bash
suiup install sui@testnet
```

Verify installation:

```bash
sui --version
# Expected output: sui 1.52.0-069e0269af84 (or later)
```

### 3. Install Sui Wallet

Install a Sui wallet browser extension. This task uses Slush Wallet:

**Slush Wallet:**
[Chrome Extension Link](https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil?pli=1)

After installation:
1. Create a new wallet or import existing one
2. Save your seed phrase securely
3. Your wallet address will be displayed

**Wallet Address Used:** `0x18f98e22eb8da55a01b75c39542bb5bc35e33ff1bd9d9df30c04b77ec5df57b6`

### 4. Import Wallet to Sui CLI

To interact with your wallet address via CLI:

```bash
sui keytool import <YOUR_SEED_PHRASE> ed25519 --alias <YOUR_ADDRESS_NAME>
```

Example:
```bash
sui keytool import "your twelve word seed phrase here" ed25519 --alias slush-wallet
```

### 5. View All Addresses

Check all addresses managed by Sui CLI:

```bash
sui client addresses
```

### 6. Switch to Your Wallet Address

```bash
sui client switch --address 0x18f98e22eb8da55a01b75c39542bb5bc35e33ff1bd9d9df30c04b77ec5df57b6
```

### 7. Check Balance

Verify your wallet has testnet SUI:

```bash
sui client balance
```

If you need testnet tokens, use the [Sui Testnet Faucet](https://discord.com/channels/916379725201563759/971488439931392130).

## Smart Contract: Hello Move

### Contract Code

```rust
module hello_move::hello_move;

use std::string::{Self, String};

/// An object that contains an arbitrary string
public struct Huyphamcs has key, store {
    id: UID,
    /// A string contained in the object
    text: String,
}

#[lint_allow(self_transfer)]
public entry fun hello_move(ctx: &mut TxContext) {
    let object = Huyphamcs {
        id: object::new(ctx),
        text: string::utf8(b"Hello World Sui! I'm Anderson"),
    };
    transfer::public_transfer(object, tx_context::sender(ctx));
}

#[test_only]
public fun get_text(hello: &Huyphamcs): String {
    hello.text
}
```

### Contract Explanation

- **Module:** `hello_move::hello_move`
- **Struct:** `Huyphamcs` - An object with `key` and `store` abilities
  - `id`: Unique identifier for the object
  - `text`: String containing the hello message
- **Function:** `hello_move()` - Entry function that creates and transfers the object
- **Test Function:** `get_text()` - Helper function for testing

## Building and Deployment

### 1. Build the Contract

Navigate to the contract directory and build:

```bash
cd hello_move
sui move build
```

This compiles your Move code and checks for errors.

### 2. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

### 3. Deployment Information

After successful deployment, note the following from the output:

**Published Package:**
- **Package ID:** `0xb3ec91eb0df430756a48639cb8fa52d1307df12062c8e7aaf48fe7723665129a`
- **Module:** `hello_move`
- **Version:** 1

**Transaction Details:**
- **Digest:** `F3iVjahxLKLyWtxLh3qHXWufjDybQ6PNFm7o9i4RhG3o`
- **Transaction Link:** [View on Explorer](https://testnet.suivision.xyz/txblock/F3iVjahxLKLyWtxLh3qHXWufjDybQ6PNFm7o9i4RhG3o?tab=Changes)

**Created Objects:**
- **UpgradeCap:** `0x200a2aee0b9f5fd31df699a4464cf83367a726885061c8729cb03e4447ad659a`

## Interacting with the Contract

### Call the hello_move Function

```bash
sui client call \
  --package 0xb3ec91eb0df430756a48639cb8fa52d1307df12062c8e7aaf48fe7723665129a \
  --module hello_move \
  --function hello_move
```

### Created Object

After calling the function:

**Object ID:** `0xb2169f1733acea0eb9169705e2bfb3bf6677de85fe77ce27fc201b6bf2a14e6c`

**Transaction Digest:** `HY7zyZaGUGhR7U5MdESuNCAEG2nRzeBhmcn4jf3u9HWA`

### View the Created Object

```bash
sui client object 0xb2169f1733acea0eb9169705e2bfb3bf6677de85fe77ce27fc201b6bf2a14e6c
```

This will display the object's content, including the "Hello World Sui! I'm Anderson" message.

## Key Concepts Learned

1. **Sui CLI Setup:** Installing and configuring the Sui development environment
2. **Wallet Management:** Creating and importing wallets to CLI
3. **Move Compilation:** Building Move smart contracts
4. **Contract Deployment:** Publishing contracts to Sui testnet
5. **Object Creation:** Creating on-chain objects with custom data
6. **Transaction Execution:** Calling contract functions via CLI
7. **Object Querying:** Retrieving and inspecting on-chain objects

## Important Commands Reference

```bash
# Build contract
sui move build

# Deploy contract
sui client publish --gas-budget 100000000

# Call contract function
sui client call --package <PACKAGE_ID> --module <MODULE> --function <FUNCTION>

# View object
sui client object <OBJECT_ID>

# Check balance
sui client balance

# List addresses
sui client addresses

# Switch address
sui client switch --address <ADDRESS>
```

## Troubleshooting

### Issue: "Client/Server API version mismatch"
This is a warning and typically doesn't affect functionality. Update Sui CLI if needed:
```bash
suiup update
```

### Issue: "Insufficient gas"
Ensure your wallet has enough testnet SUI. Get tokens from the faucet.

### Issue: "Address not found"
Make sure you've properly imported your wallet using `sui keytool import`.

## Next Steps

After completing this task, you should:
1. Understand the basic Sui development workflow
2. Be comfortable with Sui CLI commands
3. Know how to deploy and interact with contracts

Move on to [Task 2: Tokens](../task-2) to learn about creating custom tokens on Sui!

## Resources

- [Sui Documentation](https://docs.sui.io/)
- [Sui Move Language Book](https://move-book.com/)
- [Sui Testnet Explorer](https://testnet.suivision.xyz/)
- [Sui GitHub](https://github.com/MystenLabs/sui)
