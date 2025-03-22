"use client";

import { ContentWrapper } from "@/components";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import type React from "react";
import Image from "next/image";

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

const LogoWrapper = styled.div`
  position: relative;
  width: 13rem;
  height: 13rem; // Must set height for fill mode
  border-radius: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 10rem;
    height: 10rem;
  }
`;

const Logo = ({ src, alt }: { src: string; alt: string }) => (
  <LogoWrapper>
    <Image
      className="logo"
      src={src}
      alt={alt}
      fill
      style={{ objectFit: "contain" }}
      priority
      {...(src.endsWith(".gif") && { unoptimized: true })}
    />
  </LogoWrapper>
);

const logos = [
  "Across the Spider-Verse 3.png",
  "Agatha All Along.png",
  "Ant-Man and the Wasp Quantumania.gif",
  "Deadpool & Wolverine.gif",
  "Eternals.png",
  "Guardians of the Galaxy Vol 3.png",
  "Loki 1.png",
  "Moon Knight.png",
  "Ms Marvel Kamala 1 sticker.gif",
  "Pride 2024.png",
  "Rivals.gif",
  "Secret Invasion 2.jpg",
  "The Marvels.gif",
  "Venom 3.png",
  "Werewolf by Night.gif",
  "X-Men 97.png",
];

export default function Home() {
  const [logo, setLogo] = useState("/img/logo.svg");

  const handleLogoChange = () => {
    const randomLogo = logos[Math.floor(Math.random() * logos.length)];
    if (randomLogo !== logo) {
      setLogo(`/img/logos/${randomLogo}`);
    } else {
      handleLogoChange();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const logoElement = document.querySelector(".logo");

    if (logoElement) {
      logoElement.addEventListener("mouseover", handleLogoChange);
      return () => {
        logoElement.removeEventListener("mouseover", handleLogoChange);
      };
    }
  }, []);

  return (
    <ContentWrapper showNavbar={false} showFooter={false}>
      <CentreContent>
        <BodyWrapper>
          <Logo src={logo} alt="Marvel Discord Logo" />
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
function onEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
