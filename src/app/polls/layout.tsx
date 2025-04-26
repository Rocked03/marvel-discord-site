"use client";

import { Navbar } from "@/components";
import { Container, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ThemeProvider } from "next-themes";

import "./polls-globals.css";
import styled from "styled-components";

const BaseContainer = styled(Container)`
  margin-inline: 1rem;
`;

export default function PollsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class">
      <Theme accentColor="red" radius="large" scaling="110%">
        <Navbar />
        <BaseContainer size="4">{children}</BaseContainer>
      </Theme>
    </ThemeProvider>
  );
}
