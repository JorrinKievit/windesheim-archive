import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, Text, MantineProvider, Title, Tooltip } from "@mantine/core";
import TextLink from "../components/TextLink";
import Head from "next/head";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { t } = useTranslation("footer");
  return (
    <>
      <Head>
        <title>Windesheim Archive</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
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
          <Title pr={128}>Windesheim Archive</Title>
          <Tooltip
            label={
              router.locale === "nl" ? "Switch to English" : "In het Nederlands"
            }
            sx={{ border: "none", margin: 0, height: "50px" }}
          >
            <Link
              href="/"
              locale={router.locale === "nl" ? "en" : "nl"}
              passHref
            >
              <a>
                {router.locale === "nl" ? (
                  <Image
                    src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg"
                    width="50px"
                    height="50px"
                    alt="US flag"
                  />
                ) : (
                  <Image
                    src="https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NL.svg"
                    width="50px"
                    height="50px"
                    alt="NL flag"
                  />
                )}
              </a>
            </Link>
          </Tooltip>
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
            {t("made_by")}{" "}
            <TextLink
              href="https://www.linkedin.com/in/JorrinKievit/"
              text="Jorrin Kievit"
            />
            , {t("credits")}. Source code:{" "}
            <TextLink
              href="https://github.com/JorrinKievit/windesheim-archive"
              text="GitHub"
            />
          </Text>
        </Box>
      </MantineProvider>
    </>
  );
}

export default appWithTranslation(MyApp);

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "footer"])),
  },
});
