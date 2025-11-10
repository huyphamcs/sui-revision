# Task 4: Move Game

## Overview

This task implements a number guessing game smart contract on Sui blockchain. The game demonstrates advanced concepts like shared objects, admin capabilities, pool management, and user interactions. Players can deposit SUI tokens to play, guess numbers, and the admin can manage the game pool.

## Learning Objectives

- Understand shared objects and their use cases
- Implement admin capabilities and access control
- Manage on-chain game state and token pools
- Handle user interactions and game logic
- Work with randomness and game mechanics

## Deployment Information

- **Package ID:** `0x1a77bfe08cdcb1fe2a993f22f8c4951ea3ddd2fe0f0e0e4349d40e0c65081e29`
- **Game Object ID (Shared):** `0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68`
- **Admin Object ID:** `0x8529515e33fe27e2443228f4c6cebc8ff8a50fa56ff2838a8bcaab9a6721b4d5`
- **Holding Asset Object:** `0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25`
- **Play Transaction:** [View on Explorer](https://testnet.suivision.xyz/txblock/DgwRmb34ULNj1NvaxNz8BATvTJsAnWDZLTzK2j36MkwA)
- **Withdraw Transaction:** [View on Explorer](https://testnet.suivision.xyz/txblock/FWX9HzeLgJiNTnQyBZh3utFPAfpiKuZzdUZuYtxaqqxG)

## Game Mechanics

### How the Game Works

1. **Game Initialization:** A shared Game object is created during deployment
2. **Deposit Funds:** Users deposit SUI tokens into the game pool
3. **Play Game:** Users guess a number by calling the play function
4. **Game Logic:** The contract evaluates the guess and determines outcome
5. **Admin Control:** Only admin can withdraw funds from the pool

### Game Components

1. **Game Object (Shared):** Contains game state and token pool
2. **Admin Capability:** Grants special permissions to the game administrator
3. **Holding Assets:** SUI tokens deposited by players
4. **Game Logic:** Number guessing and validation

## Building and Deployment

### 1. Build the Contract

```bash
cd move_game
sui move build
```

### 2. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

### 3. Important Objects Created

After deployment, note these object IDs:
- **Game Object:** Shared object for game state
- **Admin Capability:** Object granting admin rights
- Both will be displayed in the deployment output

## Game Functions

### 1. Deposit to Game Pool

Players deposit SUI tokens to participate:

```bash
sui client call \
  --package 0x1a77bfe08cdcb1fe2a993f22f8c4951ea3ddd2fe0f0e0e4349d40e0c65081e29 \
  --module move_game \
  --function deposit \
  --args 0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68 \
         0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25 \
         100000
```

**Parameters:**
- `0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68` - Game object ID (shared)
- `0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25` - SUI coin object to deposit
- `100000` - Amount to deposit (in MIST)

### 2. Play the Game

Make a guess and play:

```bash
sui client call \
  --package 0x1a77bfe08cdcb1fe2a993f22f8c4951ea3ddd2fe0f0e0e4349d40e0c65081e29 \
  --module move_game \
  --function play \
  --args 0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68 \
         0x8 \
         true \
         0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25
```

**Parameters:**
- `0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68` - Game object ID
- `0x8` - Your guess (number)
- `true` - Additional game parameter (e.g., high/low guess)
- `0x90996071d31a13b8125729a1af6d2ce0b6ce48aedf9e6add745b09db3e89fd25` - Coin object for betting

### 3. Withdraw (Admin Only)

Only the admin can withdraw funds from the pool:

```bash
sui client call \
  --package 0x1a77bfe08cdcb1fe2a993f22f8c4951ea3ddd2fe0f0e0e4349d40e0c65081e29 \
  --module move_game \
  --function withdraw \
  --args 0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68 \
         0x8529515e33fe27e2443228f4c6cebc8ff8a50fa56ff2838a8bcaab9a6721b4d5 \
         10000
```

**Parameters:**
- `0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68` - Game object ID
- `0x8529515e33fe27e2443228f4c6cebc8ff8a50fa56ff2838a8bcaab9a6721b4d5` - Admin capability object
- `10000` - Amount to withdraw (in MIST)

## Key Concepts

### 1. Shared Objects

The Game object is **shared**, meaning:
- Multiple users can interact with it simultaneously
- Transactions involving shared objects require consensus
- Perfect for multiplayer games and DeFi applications

```rust
public struct Game has key {
    id: UID,
    pool: Balance<SUI>,
    // other game state
}

// Share the game object during initialization
public fun init(ctx: &mut TxContext) {
    let game = Game {
        id: object::new(ctx),
        pool: balance::zero(),
    };
    transfer::share_object(game);
}
```

### 2. Admin Capabilities

Admin capabilities provide secure access control:

```rust
public struct AdminCap has key, store {
    id: UID,
}

public fun withdraw(
    game: &mut Game,
    admin: &AdminCap,  // Requires admin capability
    amount: u64,
    ctx: &mut TxContext
) {
    // Only callable with valid AdminCap
}
```

### 3. Balance Management

The game maintains a balance pool:

```rust
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};

public struct Game has key {
    id: UID,
    pool: Balance<SUI>,
}

// Deposit into pool
public fun deposit(game: &mut Game, coin: Coin<SUI>) {
    let balance = coin::into_balance(coin);
    balance::join(&mut game.pool, balance);
}

// Withdraw from pool
public fun withdraw(
    game: &mut Game,
    amount: u64,
    ctx: &mut TxContext
): Coin<SUI> {
    let withdrawn = balance::split(&mut game.pool, amount);
    coin::from_balance(withdrawn, ctx)
}
```

### 4. Access Control Patterns

Different levels of access:

| Function | Access Level | Required Object |
|----------|-------------|-----------------|
| `deposit` | Public | Game (shared) |
| `play` | Public | Game (shared) |
| `withdraw` | Admin only | Admin capability |
| `view_pool` | Public | Game (shared) |

## Testing the Game

### Test Workflow

```bash
# 1. Deploy the game
sui client publish --gas-budget 100000000

# 2. Note the Game and Admin object IDs from output

# 3. Deposit funds (any user)
sui client call --package <PACKAGE_ID> --module move_game --function deposit \
  --args <GAME_ID> <COIN_OBJECT> 100000

# 4. Play the game (any user)
sui client call --package <PACKAGE_ID> --module move_game --function play \
  --args <GAME_ID> 5 true <COIN_OBJECT>

# 5. Withdraw funds (admin only)
sui client call --package <PACKAGE_ID> --module move_game --function withdraw \
  --args <GAME_ID> <ADMIN_CAP> 50000
```

### Check Game State

View the game object to see pool balance:

```bash
sui client object 0xba025c9b4e1e9b24e0f54872e47a0648b42c23e2fa945689e791a200b1eb2e68
```

## Advanced Features

### Add Event Emissions

Track game events:

```rust
use sui::event;

public struct GamePlayed has copy, drop {
    player: address,
    guess: u64,
    result: bool,
    amount: u64,
}

public fun play(/* params */) {
    // Game logic...
    event::emit(GamePlayed {
        player: sender(ctx),
        guess,
        result: won,
        amount,
    });
}
```

### Implement Winnings

Pay out winners:

```rust
public fun play(
    game: &mut Game,
    guess: u64,
    bet: Coin<SUI>,
    ctx: &mut TxContext
) {
    let bet_amount = coin::value(&bet);

    if (guess == winning_number) {
        // Player wins - pay double
        let winnings = balance::split(&mut game.pool, bet_amount * 2);
        transfer::public_transfer(
            coin::from_balance(winnings, ctx),
            sender(ctx)
        );
    } else {
        // Player loses - add bet to pool
        balance::join(&mut game.pool, coin::into_balance(bet));
    }
}
```

## Security Considerations

1. **Admin Key Protection:** Keep the admin capability object secure
2. **Balance Checks:** Always verify sufficient pool balance before withdrawals
3. **Input Validation:** Validate all user inputs (guess ranges, amounts, etc.)
4. **Reentrancy:** Sui's object model prevents traditional reentrancy attacks
5. **Fair Game Logic:** Ensure randomness is secure (consider using Sui's randomness features)

## Common Issues

### Issue: "Shared object conflict"
- Multiple transactions trying to modify the same shared object
- Wait and retry the transaction

### Issue: "Unauthorized withdrawal"
- Only the admin (holder of AdminCap) can withdraw
- Ensure you're using the correct admin address

### Issue: "Insufficient pool balance"
- The game pool doesn't have enough SUI
- Deposit more funds or reduce withdrawal amount

## Use Cases

1. **Casino Games:** Dice, roulette, number guessing
2. **Lotteries:** On-chain lottery systems
3. **Prediction Markets:** Betting on outcomes
4. **Gaming Platforms:** Multi-player game economies
5. **Prize Pools:** Tournament and competition pools

## Next Steps

After completing this task, you should understand:
- How to use shared objects for multi-user interactions
- Implementing admin capabilities and access control
- Managing token pools in smart contracts
- Building interactive game logic

Continue to [Task 5: Move Swap](../task-5) to learn about building a decentralized exchange!

## Resources

- [Sui Shared Objects](https://docs.sui.io/concepts/object-ownership/shared)
- [Sui Coin Module](https://github.com/MystenLabs/sui/blob/main/crates/sui-framework/docs/coin.md)
- [Sui Balance Module](https://github.com/MystenLabs/sui/blob/main/crates/sui-framework/docs/balance.md)
- [Building Games on Sui](https://docs.sui.io/guides/developer/app-examples)
