import { Transaction } from "@mysten/sui/transactions";
import { Button, Card, Flex, Heading, Text, Box } from "@radix-ui/themes";
import { PlusCircledIcon, CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();

  function create() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${counterPackageId}::counter::create`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          onCreated(effects?.created?.[0]?.reference?.objectId!);
        },
      },
    );
  }

  return (
    <Card size="4" style={{ minWidth: "500px", maxWidth: "600px" }}>
      <Flex direction="column" gap="5" align="center" style={{ textAlign: "center" }}>
        {/* Icon */}
        <Box
          style={{
            padding: "1.5rem",
            borderRadius: "50%",
            background: "var(--accent-a3)",
            display: "inline-flex"
          }}
        >
          <CounterClockwiseClockIcon width="48" height="48" color="var(--accent-9)" />
        </Box>

        {/* Heading and Description */}
        <Flex direction="column" gap="2">
          <Heading size="6">Create Your Counter</Heading>
          <Text size="3" color="gray" style={{ maxWidth: "400px" }}>
            Get started by creating a new counter on the Sui blockchain.
            Your counter will be stored on-chain and you'll be able to increment it anytime.
          </Text>
        </Flex>

        {/* Features List */}
        <Flex direction="column" gap="2" align="start" style={{ width: "100%", padding: "0 1rem" }}>
          <Flex gap="2" align="center">
            <Box style={{ color: "var(--accent-9)" }}>✓</Box>
            <Text size="2" color="gray">On-chain storage on Sui blockchain</Text>
          </Flex>
          <Flex gap="2" align="center">
            <Box style={{ color: "var(--accent-9)" }}>✓</Box>
            <Text size="2" color="gray">Increment counter with blockchain transactions</Text>
          </Flex>
          <Flex gap="2" align="center">
            <Box style={{ color: "var(--accent-9)" }}>✓</Box>
            <Text size="2" color="gray">Reset counter as the owner</Text>
          </Flex>
        </Flex>

        {/* Create Button */}
        <Button
          size="4"
          onClick={() => {
            create();
          }}
          disabled={isSuccess || isPending}
          style={{
            width: "100%",
            cursor: isSuccess || isPending ? "not-allowed" : "pointer",
            background: isSuccess || isPending ? undefined : "var(--accent-9)"
          }}
        >
          <Flex align="center" gap="2" justify="center">
            {isSuccess || isPending ? (
              <>
                <ClipLoader size={20} color="white" />
                <Text size="4" weight="medium">Creating Counter...</Text>
              </>
            ) : (
              <>
                <PlusCircledIcon width="20" height="20" />
                <Text size="4" weight="medium">Create New Counter</Text>
              </>
            )}
          </Flex>
        </Button>
      </Flex>
    </Card>
  );
}
