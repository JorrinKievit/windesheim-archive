import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, Text, MantineProvider, Title } from "@mantine/core";
import TextLink from "../components/TextLink";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withNormalizeCSS
      withGlobalStyles
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderBottom: `1px solid ${theme.colors.gray[8]}`,
          height: "50px",
          "@media (max-width: 340px)": {
            height: "100px",
          },
        })}
      >
        <Title>Windesheim Archive</Title>
      </Box>
      <Component {...pageProps} />
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderTop: `1px solid ${theme.colors.gray[8]}`,
          height: "50px",
          "@media (max-width: 340px)": {
            height: "100px",
          },
        })}
      >
        <Text>
          Made by{" "}
          <TextLink
            href="https://www.linkedin.com/in/JorrinKievit/"
            text="Jorrin Kievit"
          />
          , Credits to Steph#3907 on Discord
        </Text>
      </Box>
    </MantineProvider>
  );
}

export default MyApp;
