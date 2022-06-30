import {
  Container,
  TextInput,
  Group,
  Button,
  Progress,
  Box,
  Text,
  Stack,
  Alert,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import type { GetStaticProps, NextPage } from "next";
import { Cookies, ProgressEvent } from "../types";
import { ArchiveHandler } from "../utils/archiveHandler";
import JSCookies from "js-cookie";
import { WINDESHEIM_URL } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import TextLink from "../components/TextLink";
import InstructionModal from "../components/InstructionModal";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [opened, setOpened] = useState(false);
  const form = useForm<Cookies>({
    initialValues: { _3sct: "", "N%40TCookie": "" },
  });

  const theme = useMantineTheme();

  const handleSubmit = async (cookies: Cookies) => {
    JSCookies.set("_3sct", cookies._3sct);
    JSCookies.set("N@TCookie", cookies["N%40TCookie"]);
    JSCookies.set("IsActiveOrIsRunningInMSTeams", "False");

    const archiveHandler = new ArchiveHandler();
    const dir = await window.showDirectoryPicker();
    archiveHandler.FileSystemDirectoryHandle = dir;
    await archiveHandler.getArchive();
  };

  const updateProgress = useCallback((e: CustomEvent<ProgressEvent>) => {
    setProgress(e.detail.progress);
  }, []) as EventListener;

  useEffect(() => {
    document.addEventListener("updateProgress", updateProgress);
    return () => {
      document.removeEventListener("updateProgress", updateProgress);
    };
  }, [updateProgress]);

  useEffect(() => {
    //detect browser feature
    setDisabled(!("showDirectoryPicker" in window));
  }, []);

  return (
    <>
      <Container size="sm">
        <Stack spacing={14}>
          <Text>
            {t("the")} <TextLink href={WINDESHEIM_URL} text="Windesheim ELO" />{" "}
            {t("first_paragraph")}{" "}
            <TextLink href={WINDESHEIM_URL} text="Windesheim ELO" />.
          </Text>
          <Text>
            {t("second_paragraph")}{" "}
            <Box
              component="span"
              sx={{
                color: theme.colors.blue[7],
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setOpened(true)}
            >
              {t("cookies_question")}
            </Box>
          </Text>
          <Text>{t("third_paragraph")}</Text>
          <Alert title="Note:">
            <Stack spacing={6}>
              <Text>{t("note.first_note")}</Text>
              <Text>
                {t("note.second_note")}{" "}
                <TextLink
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker"
                  text={t("note.supported_browsers")}
                />
                :{" "}
                <span style={{ fontWeight: "bold" }}>
                  Chrome 86, Edge 86, Opera 72
                </span>
              </Text>
              <Text>{t("note.third_note")}</Text>
            </Stack>
          </Alert>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              required
              label="_3sct cookie"
              {...form.getInputProps("_3sct")}
            />
            <TextInput
              required
              label="N%40TCookie"
              {...form.getInputProps("N%40TCookie")}
            />
            <Group position="right" mt="md">
              <Button type="submit" disabled={disabled}>
                {t("archive_button")}
              </Button>
            </Group>
          </form>
          <Box pb={16}>
            <Text>{t("progress")}:</Text>
            <Progress
              value={progress}
              label={`${Math.round(progress)}%`}
              size="xl"
              animate
            />
          </Box>
        </Stack>
      </Container>

      <InstructionModal opened={opened} onClose={() => setOpened(false)} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      "common",
      "footer",
      "instruction",
    ])),
  },
});

export default Home;
