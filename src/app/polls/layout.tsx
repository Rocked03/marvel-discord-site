"use client";

import { Navbar } from "@/components";
import { Container, Portal, Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

import styled from "styled-components";
import { AuthProvider } from "@/contexts/AuthProvider";
import ProfileContainer from "@/components/polls/profileButton";
import { TagProvider } from "@/contexts/TagContext";
import { GlobalDataPickerStyles } from "@/components/polls/datePicker";

import "@radix-ui/themes/styles.css";
import "./polls-globals.css";

const BaseContainer = styled(Container)`
  margin-inline: 1rem;
`;

function DatePickerPortal() {
  return (
    <Portal>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Theme accentColor="red" radius="large" scaling="110%">
          <div id="datepicker-portal" />
        </Theme>
      </ThemeProvider>
    </Portal>
    //5 #323035
    //4 #2b292d
  );
}

export default function PollsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TagProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Theme accentColor="red" radius="large" scaling="110%">
            <GlobalDataPickerStyles />
            <Navbar rightComponent={<ProfileContainer />} />
            <BaseContainer size="4">{children}</BaseContainer>
            <DatePickerPortal />
          </Theme>
        </ThemeProvider>
      </TagProvider>
    </AuthProvider>
  );
}
