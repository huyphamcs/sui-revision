# Task 5: Move Swap

## Overview

This task implements a basic decentralized exchange (DEX) that allows users to swap between two different tokens: `my_coin` and `faucet_coin`. This demonstrates fundamental DeFi concepts including liquidity pools, token swapping, and automated market makers (AMM).

## Learning Objectives

- Understand liquidity pool mechanics
- Implement token swap functionality
- Manage multiple token types in one contract
- Handle balance pools for different coins
- Build basic DeFi protocols

## Deployment Information

- **Package ID:** `0x183460f2dfa39ba90b8023ab4b585b5b1eadddb93328df57b495a57984dfbdf9`
- **Pool ID:** `0x3d3b82f76fd924c48724c1d319f263cab799641281bc0c73bbe9715ef9cff1ed`
- **My Coin Object:** `0xc3e1b80aa20f16f46769b189ec573b87ce6fbbe1568431cc497bc32c98818f4e`
- **Faucet Coin Object:** `0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25`
- **Owner Address:** `0x18f98e22eb8da55a01b75c39542bb5bc35e33ff1bd9d9df30c04b77ec5df57b6`
- **Client Address:** `0xbbad2c33857a81e3b7edf170f8b6dc2aac2476afc78e4bed9bbd1587befe1c22`

## Pool Status

Current balances in the liquidity pool:
- **my_coin balance:** 10,000,100,000
- **faucet_coin balance:** 1,999,990,000

## Prerequisites

Before starting this task, ensure you have:
1. Completed [Task 2: Tokens](../task-2) to have my_coin and faucet_coin deployed
2. Both token package IDs and some coins of each type
3. Understanding of basic token operations

## DEX Architecture

### Pool Structure

```rust
public struct Pool has key {
    id: UID,
    my_coin_balance: Balance<MY_COIN>,
    faucet_coin_balance: Balance<FAUCET_COIN>,
}
```

### Core Functions

1. **deposit_my_coin:** Add my_coin to the pool
2. **deposit_faucet_coin:** Add faucet_coin to the pool
3. **swap_my_coin_to_faucet_coin:** Swap my_coin for faucet_coin
4. **swap_faucet_coin_to_my_coin:** Swap faucet_coin for my_coin

## Building and Deployment

### 1. Build the Contract

```bash
cd move_swap
sui move build
```

### 2. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

### 3. Set Environment Variables

For convenience, set these variables:

```bash
export packageId=0x183460f2dfa39ba90b8023ab4b585b5b1eadddb93328df57b495a57984dfbdf9
export poolId=0x3d3b82f76fd924c48724c1d319f263cab799641281bc0c73bbe9715ef9cff1ed
```

## Using the DEX

### 1. Deposit my_coin to Pool

Add liquidity by depositing my_coin:

```bash
sui client call \
  --package $packageId \
  --module move_swap \
  --function deposit_my_coin \
  --args $poolId 0xc3e1b80aa20f16f46769b189ec573b87ce6fbbe1568431cc497bc32c98818f4e \
  --gas-budget 10000000
```

**Parameters:**
- `$poolId` - The pool object ID
- `0xc3e1b80aa20f16f46769b189ec573b87ce6fbbe1568431cc497bc32c98818f4e` - my_coin object to deposit

### 2. Deposit faucet_coin to Pool

Add liquidity by depositing faucet_coin:

```bash
sui client call \
  --package $packageId \
  --module move_swap \
  --function deposit_faucet_coin \
  --args $poolId 0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25 \
  --gas-budget 10000000
```

**Parameters:**
- `$poolId` - The pool object ID
- `0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25` - faucet_coin object to deposit

### 3. Swap my_coin to faucet_coin

Exchange your my_coin for faucet_coin:

```bash
sui client call \
  --package 0x183460f2dfa39ba90b8023ab4b585b5b1eadddb93328df57b495a57984dfbdf9 \
  --module move_swap \
  --function swap_my_coin_to_faucet_coin \
  --args 0x3d3b82f76fd924c48724c1d319f263cab799641281bc0c73bbe9715ef9cff1ed \
         0xf2d2a37911db2d42a4ef432cbca4dd6bea4d3d8f5b41615e76a8e77ccbe4f7c9 \
  --gas-budget 10000000
```

**Parameters:**
- Pool ID
- my_coin object to swap

### 4. Swap faucet_coin to my_coin

Exchange your faucet_coin for my_coin:

```bash
sui client call \
  --package 0x183460f2dfa39ba90b8023ab4b585b5b1eadddb93328df57b495a57984dfbdf9 \
  --module move_swap \
  --function swap_faucet_coin_to_my_coin \
  --args 0x3d3b82f76fd924c48724c1d319f263cab799641281bc0c73bbe9715ef9cff1ed \
         0x08f38b88a5d01b92fc78d6a69811ebfc8f952d8a5cd404ca93e427dce5e60ebd \
  --gas-budget 10000000
```

**Parameters:**
- Pool ID
- faucet_coin object to swap

## Checking Pool Status

View current pool balances:

```bash
sui client object $poolId
```

Or with full ID:

```bash
sui client object 0x3d3b82f76fd924c48724c1d319f263cab799641281bc0c73bbe9715ef9cff1ed
```

This displays:
- Pool object details
- my_coin balance
- faucet_coin balance
- Other pool metadata

## Key Concepts

### 1. Liquidity Pools

A liquidity pool holds reserves of two tokens that users can trade against:

```rust
public struct Pool has key {
    id: UID,
    my_coin_balance: Balance<MY_COIN>,
    faucet_coin_balance: Balance<FAUCET_COIN>,
}
```

**Benefits:**
- Decentralized trading without order books
- Always available liquidity
- Automated pricing based on pool ratios

### 2. Constant Product Formula

Basic AMM uses the formula: `x * y = k`

- `x` = my_coin balance
- `y` = faucet_coin balance
- `k` = constant

When swapping:
- Input increases one balance
- Output decreases the other balance
- `k` remains approximately constant (minus fees)

### 3. Slippage

Price impact based on trade size relative to pool:

- **Small trades:** Minimal slippage
- **Large trades:** Higher slippage
- **Deep pools:** Less slippage for same trade size

### 4. Impermanent Loss

When providing liquidity, value changes due to price movements:

- Tokens can be worth different amounts than when deposited
- Only "realized" when removing liquidity
- Offset by trading fees in active pools

## Advanced Implementation

### Add Swap Fee

```rust
const FEE_PERCENT: u64 = 30; // 0.3% fee
const FEE_SCALE: u64 = 10000;

public fun swap_my_coin_to_faucet_coin(
    pool: &mut Pool,
    input: Coin<MY_COIN>,
    ctx: &mut TxContext
): Coin<FAUCET_COIN> {
    let input_amount = coin::value(&input);
    let fee = (input_amount * FEE_PERCENT) / FEE_SCALE;
    let input_minus_fee = input_amount - fee;

    // Calculate output using constant product formula
    let output_amount = calculate_output(
        input_minus_fee,
        balance::value(&pool.my_coin_balance),
        balance::value(&pool.faucet_coin_balance)
    );

    // Add input to pool
    balance::join(&mut pool.my_coin_balance, coin::into_balance(input));

    // Remove output from pool
    let output_balance = balance::split(&mut pool.faucet_coin_balance, output_amount);
    coin::from_balance(output_balance, ctx)
}
```

### Add Liquidity Provider Tokens

```rust
public struct LP_TOKEN has drop {}

public fun add_liquidity(
    pool: &mut Pool,
    my_coin: Coin<MY_COIN>,
    faucet_coin: Coin<FAUCET_COIN>,
    ctx: &mut TxContext
): Coin<LP_TOKEN> {
    // Calculate LP tokens to mint
    // Add coins to pool
    // Mint and return LP tokens
}
```

### Price Oracle

```rust
public fun get_price(pool: &Pool): u64 {
    let my_coin_balance = balance::value(&pool.my_coin_balance);
    let faucet_coin_balance = balance::value(&pool.faucet_coin_balance);

    // Price of my_coin in terms of faucet_coin
    (faucet_coin_balance * PRICE_SCALE) / my_coin_balance
}
```

## Testing Workflow

```bash
# 1. Deploy swap contract
sui client publish --gas-budget 100000000

# 2. Mint some my_coin (from Task 2)
sui client call --package <MY_COIN_PACKAGE> --module my_coin --function mint_token \
  --args <TREASURY_CAP> 1000000 <YOUR_ADDRESS>

# 3. Mint some faucet_coin (from Task 2)
sui client call --package <FAUCET_COIN_PACKAGE> --module faucet_coin --function mint_token \
  --args <TREASURY_CAP> 1000000 <YOUR_ADDRESS>

# 4. Deposit both tokens to the pool
sui client call --package <SWAP_PACKAGE> --module move_swap --function deposit_my_coin \
  --args <POOL_ID> <MY_COIN_OBJECT>

sui client call --package <SWAP_PACKAGE> --module move_swap --function deposit_faucet_coin \
  --args <POOL_ID> <FAUCET_COIN_OBJECT>

# 5. Perform swaps
sui client call --package <SWAP_PACKAGE> --module move_swap --function swap_my_coin_to_faucet_coin \
  --args <POOL_ID> <MY_COIN_OBJECT>

# 6. Check pool status
sui client object <POOL_ID>
```

## Security Considerations

1. **Price Manipulation:** Large trades can manipulate prices
2. **Front-Running:** Transactions can be front-run on public networks
3. **Pool Draining:** Ensure sufficient checks to prevent pool drainage
4. **Integer Overflow:** Use safe math operations
5. **Access Control:** Properly manage pool ownership and admin functions

## Common Issues

### Issue: "Insufficient liquidity"
- Pool doesn't have enough of the output token
- Add more liquidity or reduce swap amount

### Issue: "Slippage too high"
- Your trade significantly impacts the price
- Split into smaller trades or wait for more liquidity

### Issue: "Wrong token type"
- Ensure you're using the correct token type for each function
- my_coin and faucet_coin are different types

## Use Cases

1. **Token Swaps:** Exchange between different tokens
2. **Liquidity Provision:** Earn fees by providing liquidity
3. **Price Discovery:** Market-driven token pricing
4. **DEX Infrastructure:** Foundation for decentralized exchanges
5. **Cross-Chain Bridges:** Swap wrapped assets

## Comparison: Centralized vs Decentralized Exchange

| Feature | CEX | DEX (This Task) |
|---------|-----|------------------|
| **Custody** | Platform holds funds | User maintains custody |
| **Order Book** | Centralized | Liquidity pool (AMM) |
| **KYC** | Required | Not required |
| **Availability** | Business hours | 24/7 on-chain |
| **Trust** | Trust platform | Trustless (smart contract) |

## Next Steps

After completing this task, you should understand:
- How liquidity pools work
- Basic AMM (Automated Market Maker) mechanics
- Token swapping implementation
- Managing multiple token types in one contract

Complete [Task 6: Sui dApp](../task-6) to build a full-stack decentralized application with a React frontend!

## Resources

- [Uniswap Whitepaper](https://uniswap.org/whitepaper.pdf) - Original AMM concept
- [Sui DeFi Examples](https://github.com/MystenLabs/sui/tree/main/examples/move/defi)
- [Automated Market Makers](https://chain.link/education-hub/what-is-an-automated-market-maker-amm)
- [Understanding Impermanent Loss](https://academy.binance.com/en/articles/impermanent-loss-explained)
