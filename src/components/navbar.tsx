"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";

const NavbarStyle = styled.nav`
  display: flex;
  justify-content: center;
  padding: 1rem;
  width: 100%;
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

export default function Navbar() {
  return (
    <NavbarStyle>
      <Title href="/">
        <Logo src="/img/logo.svg" alt="Marvel Discord Logo" />
        Marvel Discord
      </Title>
    </NavbarStyle>
  );
}
