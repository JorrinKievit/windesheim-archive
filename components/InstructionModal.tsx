import {
  Box,
  Button,
  Group,
  Modal,
  ModalProps,
  Stepper,
  Text,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import React, { FC, useState } from "react";
import { WINDESHEIM_URL } from "../utils/constants";
import TextLink from "./TextLink";

interface InstructionModalProps {}

const InstructionModal: FC<InstructionModalProps & ModalProps> = ({
  opened,
  onClose,
}) => {
  const { t } = useTranslation("instruction");
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      title={t("modal.title")}
      size="lg"
    >
      <Stepper active={active} onStepClick={setActive} breakpoint="lg">
        <Stepper.Step
          label={t("steps.step_1.label")}
          description={t("steps.step_1.description")}
          allowStepSelect={active > 0}
        >
          <Text align="center" pb={4} style={{ fontWeight: "bold" }}>
            {t("steps.step_1.step_title")}
          </Text>
          {t("steps.step_1.step_description_1")}{" "}
          <TextLink href={WINDESHEIM_URL} text="elo.windesheim.nl" />{" "}
          {t("steps.step_1.step_description_2")}
        </Stepper.Step>
        <Stepper.Step
          label={t("steps.step_2.label")}
          allowStepSelect={active > 1}
        >
          <Text align="center" pb={4} style={{ fontWeight: "bold" }}>
            {t("steps.step_2.step_title")}
          </Text>

          <video width="100%" height={300} controls>
            <source src="/navigating_to_cookies.mp4" type="video/mp4" />
          </video>
        </Stepper.Step>
        <Stepper.Step
          label={t("steps.step_3.label")}
          allowStepSelect={active > 2}
        >
          <Text align="center" pb={4} style={{ fontWeight: "bold" }}>
            {t("steps.step_3.step_title_1")}
          </Text>
          {t("steps.step_3.step_title_2")} (
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {t("steps.step_3.step_title_3")}
          </Box>
          ) {t("steps.step_3.step_description")}
        </Stepper.Step>
        <Stepper.Completed>
          {t("steps.step_completed.description")}
        </Stepper.Completed>
      </Stepper>
      <Group position="center" mt="xl">
        <Button disabled={active == 0} variant="default" onClick={prevStep}>
          {t("buttons.back")}
        </Button>
        <Button disabled={active == 3} onClick={nextStep}>
          {t("buttons.next_step")}
        </Button>
      </Group>
    </Modal>
  );
};

export default InstructionModal;
