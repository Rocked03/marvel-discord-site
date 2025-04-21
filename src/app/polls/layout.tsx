"use client";

import { Navbar } from "@/components";
import { Container, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ThemeProvider } from "next-themes";

import "./polls-globals.css";

export default function PollsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class">
      <Theme accentColor="red" radius="large" scaling="110%">
        <Navbar />
        <Container size="4">{children}</Container>
      </Theme>
    </ThemeProvider>
  );
}
