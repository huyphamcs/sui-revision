import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading, Text, Card } from "@radix-ui/themes";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
      <Flex
        position="sticky"
        px="6"
        py="4"
        justify="between"
        align="center"
        style={{
          background: "linear-gradient(135deg, var(--accent-9) 0%, var(--accent-10) 100%)",
          borderBottom: "1px solid var(--accent-11)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Flex align="center" gap="3">
          <CounterClockwiseClockIcon width="32" height="32" />
          <Box>
            <Heading size="6" style={{ color: "white" }}>
              Counter dApp
            </Heading>
            <Text size="2" style={{ color: "var(--gray-1)", opacity: 0.9 }}>
              Powered by Sui Blockchain
            </Text>
          </Box>
        </Flex>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container size="3">
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ minHeight: "calc(100vh - 120px)", paddingTop: "3rem" }}
        >
          {currentAccount ? (
            counterId ? (
              <Counter id={counterId} />
            ) : (
              <CreateCounter
                onCreated={(id) => {
                  window.location.hash = id;
                  setCounter(id);
                }}
              />
            )
          ) : (
            <Card size="4" style={{ textAlign: "center", padding: "3rem" }}>
              <Flex direction="column" gap="4" align="center">
                <CounterClockwiseClockIcon width="64" height="64" color="var(--accent-9)" />
                <Box>
                  <Heading size="6" mb="2">Welcome to Counter dApp</Heading>
                  <Text size="3" color="gray">
                    Please connect your wallet to get started
                  </Text>
                </Box>
              </Flex>
            </Card>
          )}
        </Flex>
      </Container>
    </>
  );
}

export default App;
