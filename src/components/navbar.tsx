"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styled from "styled-components";

const NavbarStyle = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 1rem;
  width: 100%;
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Link)`
  align-items: center;
  display: flex;
  font-size: 3rem;
  font-stretch: expanded;
  font-weight: 700;
  gap: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Logo = styled.img`
  width: 3rem;
  border-radius: 0.5rem;
`;

interface NavbarProps {
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
}

export default function Navbar({ leftComponent, rightComponent }: NavbarProps) {
  return (
    <NavbarStyle>
      <Section style={{ justifyContent: "flex-start" }}>
        {leftComponent ?? <div />}
      </Section>
      <Center>
        <Title href="/">
          <Logo src="/img/logo.svg" alt="Marvel Discord Logo" />
          Marvel Discord
        </Title>
      </Center>
      <Section style={{ justifyContent: "flex-end" }}>
        {rightComponent ?? <div />}
      </Section>
    </NavbarStyle>
  );
}
