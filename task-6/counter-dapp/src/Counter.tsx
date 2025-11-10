import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text, Card, Box, Badge, Separator } from "@radix-ui/themes";
import { PlusIcon, ResetIcon, CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function Counter({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const [waitingForTxn, setWaitingForTxn] = useState("");

  const executeMoveCall = (method: "increment" | "reset") => {
    setWaitingForTxn(method);

    const tx = new Transaction();

    if (method === "reset") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(0)],
        target: `${counterPackageId}::counter::set_value`,
      });
    } else {
      tx.moveCall({
        arguments: [tx.object(id)],
        target: `${counterPackageId}::counter::increment`,
      });
    }

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await refetch();
            setWaitingForTxn("");
          });
        },
      },
    );
  };

  if (isPending) return (
    <Card size="4" style={{ textAlign: "center", padding: "3rem", minWidth: "500px" }}>
      <Flex direction="column" gap="3" align="center">
        <ClipLoader size={40} color="var(--accent-9)" />
        <Text size="3" color="gray">Loading counter...</Text>
      </Flex>
    </Card>
  );

  if (error) return (
    <Card size="4" style={{ textAlign: "center", padding: "3rem", minWidth: "500px" }}>
      <Text color="red" size="3">Error: {error.message}</Text>
    </Card>
  );

  if (!data.data) return (
    <Card size="4" style={{ textAlign: "center", padding: "3rem", minWidth: "500px" }}>
      <Text size="3">Counter not found</Text>
    </Card>
  );

  const ownedByCurrentAccount =
    getCounterFields(data.data)?.owner === currentAccount?.address;

  return (
    <Card size="4" style={{ minWidth: "500px", maxWidth: "600px" }}>
      <Flex direction="column" gap="5">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <CounterClockwiseClockIcon width="24" height="24" color="var(--accent-9)" />
            <Heading size="5">Your Counter</Heading>
          </Flex>
          {ownedByCurrentAccount && (
            <Badge color="green" size="2">Owner</Badge>
          )}
        </Flex>

        <Separator size="4" />

        {/* Counter Display */}
        <Box style={{ textAlign: "center", padding: "2rem 0" }}>
          <Text size="2" color="gray" weight="medium" mb="2" style={{ display: "block" }}>
            Current Count
          </Text>
          <Box
            style={{
              fontSize: "5rem",
              fontWeight: "bold",
              color: "var(--accent-11)",
              lineHeight: "1",
              fontFamily: "monospace",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          >
            {getCounterFields(data.data)?.value}
          </Box>
        </Box>

        <Separator size="4" />

        {/* Action Buttons */}
        <Flex direction="column" gap="3">
          <Button
            size="4"
            onClick={() => executeMoveCall("increment")}
            disabled={waitingForTxn !== ""}
            style={{
              cursor: waitingForTxn !== "" ? "not-allowed" : "pointer",
              background: waitingForTxn === "" ? "var(--accent-9)" : undefined
            }}
          >
            <Flex align="center" gap="2" justify="center" style={{ width: "100%" }}>
              {waitingForTxn === "increment" ? (
                <ClipLoader size={20} color="white" />
              ) : (
                <>
                  <PlusIcon width="20" height="20" />
                  <Text size="4" weight="medium">Increment Counter</Text>
                </>
              )}
            </Flex>
          </Button>

          {ownedByCurrentAccount && (
            <Button
              size="4"
              variant="outline"
              color="red"
              onClick={() => executeMoveCall("reset")}
              disabled={waitingForTxn !== ""}
              style={{ cursor: waitingForTxn !== "" ? "not-allowed" : "pointer" }}
            >
              <Flex align="center" gap="2" justify="center" style={{ width: "100%" }}>
                {waitingForTxn === "reset" ? (
                  <ClipLoader size={20} color="var(--red-9)" />
                ) : (
                  <>
                    <ResetIcon width="20" height="20" />
                    <Text size="4" weight="medium">Reset to Zero</Text>
                  </>
                )}
              </Flex>
            </Button>
          )}
        </Flex>

        {/* Counter ID */}
        <Box style={{
          background: "var(--gray-a2)",
          padding: "0.75rem",
          borderRadius: "var(--radius-2)",
          fontSize: "0.75rem",
          fontFamily: "monospace",
          wordBreak: "break-all",
          color: "var(--gray-11)"
        }}>
          <Text size="1" color="gray" weight="medium" style={{ display: "block", marginBottom: "0.25rem" }}>
            Counter ID:
          </Text>
          {id}
        </Box>
      </Flex>
    </Card>
  );
}
function getCounterFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as { value: number; owner: string };
}
