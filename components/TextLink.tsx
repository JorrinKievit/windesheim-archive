import { Anchor, Box } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import React, { ComponentProps, FC } from "react";

interface TextLinkProps {
  text: string;
  href: string;
}
const TextLink: FC<ComponentProps<typeof Box> & TextLinkProps> = ({
  href,
  text,
}) => {
  return (
    <Link href={href} passHref>
      <Anchor
        component="a"
        target="_blank"
        sx={(theme) => ({
          color: theme.colors.blue[7],
          "&:hover": {
            textDecoration: "underline",
          },
        })}
      >
        {text}
      </Anchor>
    </Link>
  );
};

export default TextLink;
