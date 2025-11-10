# Task 3: Move NFT

## Overview

This task demonstrates how to create and mint NFTs (Non-Fungible Tokens) on the Sui blockchain. Unlike fungible tokens (Task 2), each NFT is unique and can contain custom metadata such as text messages, images, or other properties.

## Learning Objectives

- Understand NFT structure in Move
- Create NFT contracts with custom properties
- Implement NFT minting functionality
- Transfer NFTs to specific addresses
- Query and view NFT data on-chain

## Deployment Information

- **Package ID:** `0x55d7224b22b83713277d572004ddb4aef56b79c2526b04c2b1d97dd70c466944`
- **Minted NFT Object ID:** `0x7e93bcd893cc343b5b1a0fe6d2e4de3b4e4d2a432e163d68b4e85c5e8965f393`
- **Recipient Address:** `0x7cca6ffd3777aa6303ed18e0f4f8ed8e069bc1c30bda848b6381e9f5bae77239`
- **NFT Message:** "Hello, this is Anderson!"
- **Transaction:** [View on Explorer](https://testnet.suivision.xyz/txblock/4o9RDnYPkikSPdG7wHQaM65yyM3FRk1LkmC1SC956HEh)
- **NFT Object:** [View on Explorer](https://testnet.suivision.xyz/object/0x7e93bcd893cc343b5b1a0fe6d2e4de3b4e4d2a432e163d68b4e85c5e8965f393)

## NFT Contract Structure

### Basic NFT Properties

An NFT on Sui typically contains:

1. **Unique ID (UID):** Every Sui object has a unique identifier
2. **Custom Metadata:** Properties specific to your NFT (name, description, image URL, etc.)
3. **Abilities:** `key` and `store` abilities for ownership and transferability

### Example NFT Struct

```rust
public struct MoveNFT has key, store {
    id: UID,
    name: String,
    description: String,
    url: String,
    // Add more properties as needed
}
```

## Building and Deployment

### 1. Build the Contract

```bash
cd move_nft
sui move build
```

### 2. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

The deployment will create a package with your NFT module.

### 3. Note Important IDs

From the deployment output, save:
- Package ID
- Any capability objects created (if applicable)

## Minting NFTs

### Mint Command

To mint an NFT with a custom message to a specific address:

```bash
sui client call \
  --package 0x55d7224b22b83713277d572004ddb4aef56b79c2526b04c2b1d97dd70c466944 \
  --module move_nft \
  --function mint \
  --args "Hello, this is Anderson!" 0x7cca6ffd3777aa6303ed18e0f4f8ed8e069bc1c30bda848b6381e9f5bae77239
```

**Parameters:**
- `"Hello, this is Anderson!"` - Custom message/metadata for the NFT
- `0x7cca6ffd3777aa6303ed18e0f4f8ed8e069bc1c30bda848b6381e9f5bae77239` - Recipient wallet address

### What Happens During Minting

1. A new NFT object is created with a unique ID
2. Custom metadata (message) is stored in the object
3. The NFT is transferred to the recipient address
4. The transaction is recorded on the blockchain

## Viewing NFT Data

### View NFT Object

```bash
sui client object 0x7e93bcd893cc343b5b1a0fe6d2e4de3b4e4d2a432e163d68b4e85c5e8965f393
```

This command displays:
- Object ID
- Object type
- Owner address
- Version
- All stored metadata (including your custom message)

### View NFT in Explorer

Visit the Sui testnet explorer:
```
https://testnet.suivision.xyz/object/0x7e93bcd893cc343b5b1a0fe6d2e4de3b4e4d2a432e163d68b4e85c5e8965f393
```

## Key Concepts

### 1. Unique Ownership

Each NFT is unique and can only be owned by one address at a time. The owner can:
- View the NFT
- Transfer it to another address
- Interact with it (if the contract provides additional functions)

### 2. Metadata Storage

NFT metadata is stored directly on-chain in the object's fields. This makes it:
- Permanent and immutable (unless update functions are provided)
- Verifiable and transparent
- Accessible to anyone

### 3. NFT Abilities

- **`key`:** Allows the NFT to be owned and transferred
- **`store`:** Allows the NFT to be stored in other objects or collections

### 4. Transferability

Sui NFTs can be transferred using:
- Smart contract functions
- Wallet interfaces
- CLI commands

## Advanced Features

### Add More Properties

You can enhance your NFT with additional properties:

```rust
public struct AdvancedNFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: String,
    creator: address,
    created_at: u64,
    attributes: vector<String>,
    // More custom fields
}
```

### Implement Update Functions

Allow NFT properties to be updated:

```rust
public fun update_description(
    nft: &mut MoveNFT,
    new_description: String,
    ctx: &TxContext
) {
    // Add ownership verification
    nft.description = new_description;
}
```

### Create NFT Collections

Group related NFTs together:

```rust
public struct Collection has key {
    id: UID,
    name: String,
    total_supply: u64,
    nfts: vector<ID>,
}
```

## Use Cases

1. **Digital Art:** Store artwork metadata and ownership
2. **Gaming Items:** In-game assets with unique properties
3. **Certificates:** Academic or achievement certificates
4. **Tickets:** Event tickets with unique identifiers
5. **Identity:** Digital identity tokens
6. **Collectibles:** Limited edition digital collectibles

## Testing Checklist

- [ ] Contract builds successfully
- [ ] Contract deploys to testnet
- [ ] Can mint NFT with custom metadata
- [ ] NFT appears in recipient's wallet
- [ ] Can view NFT data on explorer
- [ ] NFT has unique object ID
- [ ] Metadata is correctly stored

## Best Practices

1. **Validate Inputs:** Always validate metadata and recipient addresses
2. **Access Control:** Implement proper minting permissions if needed
3. **Metadata Standards:** Consider following existing NFT metadata standards
4. **Gas Efficiency:** Optimize storage and computation costs
5. **Event Emission:** Emit events for important actions (minting, transfers)

## Common Issues

### Issue: "Object not found"
- The NFT might not have been minted successfully
- Check transaction status on explorer
- Verify the object ID is correct

### Issue: "Cannot view NFT in wallet"
- Some wallets may not display all NFT types
- Use the explorer or CLI to verify ownership
- Ensure wallet supports Sui NFTs

### Issue: "Mint function fails"
- Check gas budget is sufficient
- Verify all required parameters are provided
- Ensure contract is deployed correctly

## Example Workflows

### Workflow 1: Basic NFT Minting

```bash
# 1. Build and deploy contract
cd move_nft
sui move build
sui client publish --gas-budget 100000000

# 2. Mint NFT to address
sui client call \
  --package <PACKAGE_ID> \
  --module move_nft \
  --function mint \
  --args "My First NFT" <RECIPIENT_ADDRESS>

# 3. View the NFT
sui client object <NFT_OBJECT_ID>
```

### Workflow 2: Multiple NFTs

```bash
# Mint multiple NFTs to different addresses
sui client call --package <PACKAGE_ID> --module move_nft --function mint \
  --args "NFT #1" <ADDRESS_1>

sui client call --package <PACKAGE_ID> --module move_nft --function mint \
  --args "NFT #2" <ADDRESS_2>

sui client call --package <PACKAGE_ID> --module move_nft --function mint \
  --args "NFT #3" <ADDRESS_3>
```

## Next Steps

After completing this task, you should understand:
- How NFTs differ from fungible tokens
- NFT structure and metadata storage on Sui
- Minting and transferring NFTs
- Querying NFT data

Continue to [Task 4: Move Game](../task-4) to learn about building interactive smart contracts with game logic!

## Resources

- [Sui NFT Standards](https://docs.sui.io/standards/nft)
- [Object Ownership on Sui](https://docs.sui.io/concepts/object-ownership)
- [Sui Move Objects](https://docs.sui.io/concepts/objects)
- [NFT Examples](https://github.com/MystenLabs/sui/tree/main/examples/move)
