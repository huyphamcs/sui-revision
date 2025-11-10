# Task 6: Sui dApp

## Overview

This task demonstrates building a complete full-stack decentralized application (dApp) on Sui blockchain. The project includes a Counter smart contract and a React frontend that allows users to connect their wallets, increment a counter, and reset it (owner only).

## Learning Objectives

- Build a full-stack dApp with React and Sui
- Integrate @mysten/dapp-kit for wallet connectivity
- Implement frontend-to-contract interactions
- Handle shared objects in a web application
- Manage access control in the UI
- Create a professional dApp user interface

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui SDK
- **@radix-ui/themes** - UI components
- **Vite** - Build tool

### Backend (Smart Contract)
- **Sui Move** - Smart contract language
- **Counter Module** - On-chain counter logic

## Deployment Information

- **Package ID:** `0x3df7d74bec63a8797812cd9ddb70edcf15f5afa7dd7aaafe6214c4b425ab61fd`
- **Counter Object ID (Shared):** `0xd4fd19b4ea584b1c79a2544dcc66efb5092f0696bf7f7a19ee5a9eec94d97177`
- **Deployment Transaction:** [View on Explorer](https://testnet.suivision.xyz/txblock/6KRxmid7sVGBHXWpxzhNj96dUsHYsChRCMjy6b8y9t9s)
- **Network:** Sui Testnet

## Project Setup

### 1. Create New dApp Project

Using @mysten/create-dapp template:

```bash
pnpm create @mysten/dapp
```

Follow the prompts:
- Choose a project name
- Select "React" template
- Select "TypeScript"

### 2. Navigate to Project

```bash
cd <your-project-name>
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Project Structure

```
counter-dapp/
├── move/
│   └── counter/
│       ├── sources/
│       │   └── counter.move
│       ├── tests/
│       └── Move.toml
├── src/
│   ├── App.tsx
│   ├── Counter.tsx
│   ├── CreateCounter.tsx
│   ├── main.tsx
│   ├── networkConfig.ts
│   └── constants.ts
├── package.json
├── vite.config.ts
└── index.html
```

## Smart Contract: Counter

### Contract Code

Located in `move/counter/sources/counter.move`:

```rust
module counter::counter {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    public struct Counter has key {
        id: UID,
        value: u64,
        owner: address,
    }

    public entry fun create(ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            value: 0,
            owner: tx_context::sender(ctx),
        };
        transfer::share_object(counter);
    }

    public entry fun increment(counter: &mut Counter) {
        counter.value = counter.value + 1;
    }

    public entry fun set_value(counter: &mut Counter, value: u64, ctx: &TxContext) {
        assert!(counter.owner == tx_context::sender(ctx), 0);
        counter.value = value;
    }
}
```

### Contract Features

1. **Create Counter:** Initializes a new shared counter
2. **Increment:** Anyone can increment the counter
3. **Set Value (Reset):** Only the owner can reset the counter

## Deploying the Contract

### 1. Build the Contract

```bash
cd move/counter
sui move build
```

### 2. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

### 3. Update Frontend Configuration

In `src/constants.ts`, add your package ID:

```typescript
export const COUNTER_PACKAGE_ID = "0x3df7d74bec63a8797812cd9ddb70edcf15f5afa7dd7aaafe6214c4b425ab61fd";
```

Update `src/networkConfig.ts` with network-specific package IDs.

## Frontend Implementation

### Main Components

#### 1. App.tsx

Main application component handling:
- Wallet connection status
- Counter ID management (via URL hash)
- Conditional rendering (create vs. view counter)

#### 2. CreateCounter.tsx

Component for creating new counters:
- Button to call `create` function
- Transaction handling and loading states
- Redirect to created counter

#### 3. Counter.tsx

Main counter display and interaction:
- Display current count value
- Increment button (public)
- Reset button (owner only)
- Loading and error states
- Real-time updates after transactions

### Key Frontend Features

#### Wallet Connection

```typescript
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

function App() {
  const currentAccount = useCurrentAccount();

  return (
    <>
      <ConnectButton />
      {currentAccount ? (
        <Counter />
      ) : (
        <p>Please connect your wallet</p>
      )}
    </>
  );
}
```

#### Transaction Execution

```typescript
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

function Counter() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const increment = () => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(counterId)],
      target: `${packageId}::counter::increment`,
    });

    signAndExecute({
      transaction: tx,
    }, {
      onSuccess: (result) => {
        console.log('Transaction successful:', result);
        // Refetch counter data
      },
    });
  };

  return <button onClick={increment}>Increment</button>;
}
```

#### Query On-Chain Data

```typescript
import { useSuiClientQuery } from "@mysten/dapp-kit";

function Counter({ id }: { id: string }) {
  const { data, isPending, error, refetch } = useSuiClientQuery(
    "getObject",
    {
      id,
      options: {
        showContent: true,
        showOwner: true,
      },
    }
  );

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const counterData = data.data.content.fields;

  return (
    <div>
      <h2>Count: {counterData.value}</h2>
    </div>
  );
}
```

## Running the dApp

### Development Mode

```bash
pnpm dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Using the dApp

### 1. Connect Wallet

1. Click "Connect Wallet" button
2. Select your Sui wallet (e.g., Slush Wallet)
3. Approve the connection

### 2. Create a Counter

1. If no counter exists, click "Create Counter"
2. Approve the transaction in your wallet
3. Wait for transaction confirmation
4. You'll be redirected to your new counter

### 3. Increment Counter

1. View your counter with current count
2. Click "Increment" button
3. Approve transaction in wallet
4. Counter value updates automatically

### 4. Reset Counter (Owner Only)

1. If you're the owner, you'll see "Reset" button
2. Click "Reset" to set counter back to 0
3. Approve transaction
4. Counter resets to 0

## CLI Interaction

You can also interact via CLI:

### Increment Counter

```bash
sui client call \
  --package 0x3df7d74bec63a8797812cd9ddb70edcf15f5afa7dd7aaafe6214c4b425ab61fd \
  --module counter \
  --function increment \
  --args 0xd4fd19b4ea584b1c79a2544dcc66efb5092f0696bf7f7a19ee5a9eec94d97177
```

### Reset Counter (Owner Only)

```bash
sui client call \
  --package 0x3df7d74bec63a8797812cd9ddb70edcf15f5afa7dd7aaafe6214c4b425ab61fd \
  --module counter \
  --function set_value \
  --args 0xd4fd19b4ea584b1c79a2544dcc66efb5092f0696bf7f7a19ee5a9eec94d97177 0
```

## Key Concepts

### 1. Shared Objects in dApps

The Counter is a **shared object**:
- Multiple users can interact simultaneously
- Updates are visible to all users
- Perfect for collaborative applications

### 2. Access Control in UI

```typescript
const isOwner = counterData.owner === currentAccount?.address;

return (
  <>
    <button onClick={increment}>Increment</button>
    {isOwner && (
      <button onClick={reset}>Reset</button>
    )}
  </>
);
```

### 3. Transaction Lifecycle

1. **Create Transaction:** Build transaction with Move call
2. **Sign:** User signs with their wallet
3. **Execute:** Submit to network
4. **Confirm:** Wait for consensus
5. **Update UI:** Refetch data and show new state

### 4. Real-time Updates

```typescript
const { mutate: signAndExecute } = useSignAndExecuteTransaction();

signAndExecute(
  { transaction: tx },
  {
    onSuccess: async (tx) => {
      // Wait for transaction to be processed
      await suiClient.waitForTransaction({ digest: tx.digest });
      // Refetch counter data
      await refetch();
    },
  }
);
```

## Enhanced UI Features

The improved UI includes:

### Modern Header
- Gradient background with accent colors
- Counter icon and branding
- Wallet connection button
- Professional styling

### Card-Based Layout
- Clean, modern counter display
- Large, readable counter value
- Icon-enhanced buttons
- Owner badge for counter owners

### Interactive Elements
- Smooth transitions and animations
- Hover effects on buttons
- Loading states with spinners
- Professional color scheme

### Responsive Design
- Works on desktop and mobile
- Centered, professional layout
- Proper spacing and padding

## Advanced Features

### Add Transaction History

```typescript
import { useSuiClientQuery } from "@mysten/dapp-kit";

function TransactionHistory({ objectId }: { objectId: string }) {
  const { data } = useSuiClientQuery("queryTransactionBlocks", {
    filter: { InputObject: objectId },
    options: { showEffects: true },
  });

  return (
    <div>
      <h3>Transaction History</h3>
      {data?.data.map((tx) => (
        <div key={tx.digest}>
          {tx.digest} - {tx.effects.status.status}
        </div>
      ))}
    </div>
  );
}
```

### Add Events Listening

```typescript
// In counter.move
use sui::event;

public struct CounterIncremented has copy, drop {
    counter_id: ID,
    new_value: u64,
}

public entry fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
    event::emit(CounterIncremented {
        counter_id: object::id(counter),
        new_value: counter.value,
    });
}
```

### Multi-Counter Support

```typescript
function App() {
  const [counters, setCounters] = useState<string[]>([]);

  const addCounter = (id: string) => {
    setCounters([...counters, id]);
  };

  return (
    <>
      {counters.map((id) => (
        <Counter key={id} id={id} />
      ))}
      <CreateCounter onCreated={addCounter} />
    </>
  );
}
```

## Troubleshooting

### Issue: "Wallet not connecting"
- Ensure wallet extension is installed
- Check you're on the correct network (testnet)
- Refresh the page and try again

### Issue: "Transaction fails"
- Verify you have sufficient SUI for gas
- Check the package ID is correct
- Ensure you're on the right network

### Issue: "Counter not updating"
- Wait for transaction confirmation
- Manually refetch the data
- Check browser console for errors

### Issue: "Reset button not appearing"
- You must be the counter owner
- Verify wallet address matches owner address
- Check access control logic

## Best Practices

1. **Error Handling:** Always handle transaction errors gracefully
2. **Loading States:** Show loading indicators during transactions
3. **User Feedback:** Provide clear feedback for all actions
4. **Gas Estimation:** Warn users about gas costs
5. **Network Detection:** Detect and handle network changes
6. **Wallet Events:** Listen for wallet disconnect events

## Deployment

### Deploy Frontend

You can deploy to:
- **Vercel:** `vercel deploy`
- **Netlify:** `netlify deploy`
- **GitHub Pages:** Configure in repository settings

Update environment variables for production:
- Network endpoints
- Package IDs
- RPC URLs

## Next Steps

Congratulations! You've completed all 6 tasks. You now have:

1. ✅ Sui development environment setup
2. ✅ Understanding of token creation
3. ✅ NFT minting knowledge
4. ✅ Game contract implementation skills
5. ✅ DEX/swap functionality experience
6. ✅ Full-stack dApp development capabilities

### Continue Learning

- Explore more complex DeFi protocols
- Build multi-contract systems
- Implement advanced UI features
- Contribute to Sui ecosystem projects

## Resources

- [@mysten/create-dapp Documentation](https://sdk.mystenlabs.com/dapp-kit/create-dapp)
- [Sui dApp Kit](https://sdk.mystenlabs.com/dapp-kit)
- [React Query (used by dApp Kit)](https://tanstack.com/query/latest)
- [Radix UI Themes](https://www.radix-ui.com/themes/docs/overview/getting-started)
- [Sui Move Examples](https://github.com/MystenLabs/sui/tree/main/examples)
- [Full-Stack dApp Tutorial](https://docs.sui.io/guides/developer/app-examples/e2e-counter)
