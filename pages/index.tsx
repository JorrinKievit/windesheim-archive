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
  List,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import type { NextPage } from "next";
import { Cookies, ProgressEvent } from "../types";
import { ArchiveHandler } from "../utils/archiveHandler";
import JSCookies from "js-cookie";
import { WINDESHEIM_URL } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import instructionPic from "../public/instruction.png";
import TextLink from "../components/TextLink";

const Home: NextPage = () => {
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const form = useForm<Cookies>({
    initialValues: { _3sct: "", "N%40TCookie": "" },
  });

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
    <Container size="sm">
      <Stack spacing={14}>
        <Text>
          The <TextLink href={WINDESHEIM_URL} text="Windesheim ELO" /> will be
          migrating to the new platform called Brightspace. On 1 September 2022
          you will no longer be able to access your files. Using this website,
          you will be able to archive all courses you have from the{" "}
          <TextLink href={WINDESHEIM_URL} text="Windesheim ELO" />.
        </Text>
        <Text>
          Below, you are required to insert your own cookies. This is a manual
          step since a browser is not allowed to retrieve cookies from an
          external site. The cookies are used to retrieve your personal courses
          and their designated files.
        </Text>
        <Image src={instructionPic} alt="instruction" priority />
        <Text>
          After inserting your credentials, press &quot;Get Archive&quot;.
          Select a folder you wish to insert all files into. Make sure you have
          enough space on your disk, all files could take up to 15GB depending
          on the amount of courses.
        </Text>
        <Alert title="Note:">
          <Stack spacing={6}>
            <Text>
              Make sure to retrieve the cookies from the same supported browser
              you are currently using to view this website.
            </Text>
            <Text>
              Only a small amount of browsers is currently supported. This is
              due to native File System. These are the current{" "}
              <TextLink
                href="https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker"
                text="supported browsers"
              />
              :{" "}
              <span style={{ fontWeight: "bold" }}>
                Chrome 86, Edge 86, Opera 72
              </span>
            </Text>
            <Text>
              Retrieving all files could also take a while. Do not close the
              window/browser after pressing &quot;Get Archive&quot;. Progress
              can be seen on the bottom of the page.
            </Text>
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
              Get Archive
            </Button>
          </Group>
        </form>
        <Box pb={16}>
          <Text>Progress:</Text>
          <Progress
            value={progress}
            label={`${Math.round(progress)}%`}
            size="xl"
            animate
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default Home;
