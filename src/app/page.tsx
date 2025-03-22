"use client";

import { ContentWrapper } from "@/components";
import Link from "next/link";
import type React from "react";
import styled from "styled-components";

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const CentreContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  margin-block: 0;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Logo = styled.img`
  width: 13rem;
  border-radius: 2rem;

  @media (max-width: 768px) {
    width: 10rem;
  }
`;

const Title = styled.h1`
  font-size: 7rem;
  font-weight: 700;
  font-stretch: expanded;

  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-stretch: expanded;
  font-variation-settings: "slnt" -10;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonStyle = styled.button`
  background-color: transparent;
  font-size: 1.5rem;
  padding-block: 0rem;
  padding-inline: 1rem;
  width: fit-content;
  font-weight: 300;
  font-stretch: semi-expanded;
  font-variation-settings: "slnt" -10;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translate(0.5rem);
  }
`;

const Button = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href}>
      <ButtonStyle>
        <p>⇀ {children}</p>
      </ButtonStyle>
    </Link>
  );
};

export default function Home() {
  return (
    <ContentWrapper showNavbar={false} showFooter={false}>
      <CentreContent>
        <BodyWrapper>
          <Logo src="/img/logo.svg" alt="Marvel Discord Logo" />
          <TextWrapper>
            <HeadingWrapper>
              <Title>Marvel Discord</Title>
              <Subtitle>
                The largest community-run server for everything Marvel.
              </Subtitle>
            </HeadingWrapper>
            <Buttons>
              <Button href="/invite">Join the server</Button>
              <Button href="/appeal">Make a ban appeal</Button>
            </Buttons>
          </TextWrapper>
        </BodyWrapper>
      </CentreContent>
    </ContentWrapper>
  );
}
