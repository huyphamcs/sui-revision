# Task 2: Tokens

## Overview

This task demonstrates how to create custom fungible tokens on the Sui blockchain using two different permission models:

1. **my_coin** - A token where only the owner can mint new tokens
2. **faucet_coin** - A public faucet where anyone can mint tokens

## Learning Objectives

- Understand token creation on Sui
- Learn about Treasury Cap and coin management
- Implement owner-restricted minting
- Create public faucet functionality
- Practice token minting and distribution

## Project Structure

```
task-2/
├── my_coin/         # Owner-only token minting
└── faucet_coin/     # Public faucet token
```

## Task 2.1: My Coin (Owner-Only Minting)

### Overview

`my_coin` is a custom token where only the owner (holder of the Treasury Cap) can mint new tokens to any address.

### Deployment Information

- **Package ID:** `0x53301f657da5a62b1fdbf945287dfa41af9ec3c2b1dea0ff3c58017c576a33ef`
- **Treasury Cap Object:** `0x9115deae76e4d9af9ee9822dc523cb21ae8e9cb6a8a24b9d06b4240a73b2ca4c`
- **Coin Metadata:** `0xa022900b5fab00926607ce44058ede515bfbbb73edede4a25dffd72b4653d057`
- **Token Symbol:** `ATK`
- **Transaction:** [View on Explorer](https://testnet.suivision.xyz/package/0x53301f657da5a62b1fdbf945287dfa41af9ec3c2b1dea0ff3c58017c576a33ef)

### Key Concepts

- **Treasury Cap:** Special capability object that grants minting rights
- **Owner-Only:** Only the address holding the Treasury Cap can mint
- **Targeted Minting:** Tokens can be minted to any recipient address

### Build and Deploy

```bash
cd my_coin
sui move build
sui client publish --gas-budget 100000000
```

### Minting Tokens

Only the owner (holder of Treasury Cap) can mint:

```bash
sui client call \
  --package 0x53301f657da5a62b1fdbf945287dfa41af9ec3c2b1dea0ff3c58017c576a33ef \
  --module my_coin \
  --function mint_token \
  --args 0x9115deae76e4d9af9ee9822dc523cb21ae8e9cb6a8a24b9d06b4240a73b2ca4c 10000 0x7cca6ffd3777aa6303ed18e0f4f8ed8e069bc1c30bda848b6381e9f5bae77239
```

**Parameters:**
- `0x9115deae76e4d9af9ee9822dc523cb21ae8e9cb6a8a24b9d06b4240a73b2ca4c` - Treasury Cap object ID
- `10000` - Amount to mint
- `0x7cca6ffd3777aa6303ed18e0f4f8ed8e069bc1c30bda848b6381e9f5bae77239` - Recipient address

### Use Cases

- Corporate tokens with controlled issuance
- Governance tokens
- Reward points systems
- Private currencies

## Task 2.2: Faucet Coin (Public Minting)

### Overview

`faucet_coin` is a public faucet where anyone can mint tokens to their own wallet. This is useful for testnets, airdrops, or practice tokens.

### Deployment Information

- **Package ID:** `0xd3c337c4851089d9ef75c0978db41ce3f2fa42538e2be53ddacb785653fd9b60`
- **Treasury Cap Object:** `0x85f659e3d24001939c056c0c13009a4ab7b9c17534e22016031b5a5ee750ce2b`
- **Transaction:** [View on Explorer](https://testnet.suivision.xyz/txblock/D1TbQn8az9tVM5mFjfHGyXUumBNQHuxKBCUsPgJzhSAp)

### Key Concepts

- **Public Access:** Anyone can call the mint function
- **Self-Minting:** Users mint tokens to their own address
- **Shared Treasury Cap:** The treasury cap is shared, allowing public access

### Build and Deploy

```bash
cd faucet_coin
sui move build
sui client publish --gas-budget 100000000
```

### Minting Tokens (Public)

Anyone can mint tokens:

```bash
sui client call \
  --package 0xd3c337c4851089d9ef75c0978db41ce3f2fa42538e2be53ddacb785653fd9b60 \
  --module faucet_coin \
  --function mint_token \
  --args 0x85f659e3d24001939c056c0c13009a4ab7b9c17534e22016031b5a5ee750ce2b 100000 0x18f98e22eb8da55a01b75c39542bb5bc35e33ff1bd9d9df30c04b77ec5df57b6
```

**Parameters:**
- `0x85f659e3d24001939c056c0c13009a4ab7b9c17534e22016031b5a5ee750ce2b` - Shared Treasury Cap object ID
- `100000` - Amount to mint
- `0x18f98e22eb8da55a01b75c39542bb5bc35e33ff1bd9d9df30c04b77ec5df57b6` - Recipient address (can be any address)

### Use Cases

- Testnet faucets
- Practice/demo tokens
- Community airdrops
- Gaming tokens

## Comparison: my_coin vs faucet_coin

| Feature | my_coin | faucet_coin |
|---------|---------|-------------|
| **Minting Permission** | Owner only (Treasury Cap holder) | Anyone (public) |
| **Treasury Cap** | Private (owned by deployer) | Shared (public access) |
| **Recipient** | Any address (specified by owner) | Any address (specified by caller) |
| **Use Case** | Controlled token supply | Open distribution |
| **Security** | High (centralized control) | Low (anyone can mint) |

## Key Concepts

### 1. Treasury Cap

The Treasury Cap is a special capability object that grants the right to mint new tokens. How it's managed determines who can mint:

- **Private ownership:** Only the owner can mint (my_coin)
- **Shared object:** Anyone can access and mint (faucet_coin)

### 2. Token Metadata

When creating a token, you define metadata including:
- Token name
- Symbol (e.g., "ATK")
- Decimals
- Description
- Icon URL (optional)

### 3. Minting

The process of creating new token units and transferring them to an address.

## Common Commands

### Check Token Balance

```bash
sui client gas
```

### View Object Details

```bash
sui client object <OBJECT_ID>
```

### Transfer Tokens

Tokens can be transferred using the Sui wallet or CLI commands.

## Important Notes

1. **Gas Costs:** Minting tokens requires gas fees in SUI
2. **Treasury Cap Security:** Keep your treasury cap safe for owner-only tokens
3. **Public Faucets:** Be aware that public faucets can be drained by anyone
4. **Token Standards:** Sui tokens follow the Coin standard from the Sui framework

## Testing

### Test my_coin

1. Deploy the contract
2. Note the Treasury Cap object ID
3. Try minting from the owner address ✅
4. Try minting from a different address ❌ (should fail)

### Test faucet_coin

1. Deploy the contract
2. Note the shared Treasury Cap object ID
3. Mint tokens from any address ✅
4. Verify tokens appear in the recipient wallet ✅

## Troubleshooting

### Error: "Treasury cap not found"
- Ensure you're using the correct Treasury Cap object ID from deployment output

### Error: "Unauthorized"
- For my_coin: Only the owner can mint. Make sure you're using the address that deployed the contract

### Error: "Insufficient gas"
- Ensure your wallet has enough SUI for gas fees

## Next Steps

After completing this task, you should understand:
- How to create custom tokens on Sui
- The difference between owner-controlled and public token minting
- How to use Treasury Caps for access control
- Token minting and distribution

Continue to [Task 3: Move NFT](../task-3) to learn about creating NFTs on Sui!

## Resources

- [Sui Coin Standard](https://docs.sui.io/standards/coin)
- [Move Coin Module](https://github.com/MystenLabs/sui/blob/main/crates/sui-framework/docs/coin.md)
- [Sui Framework Documentation](https://docs.sui.io/references/framework)
