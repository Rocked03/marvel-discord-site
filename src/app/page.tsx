"use client";

import { ContentWrapper } from "@/components";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";
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

const shake = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, 1px); }
  100% { transform: translate(0, 0); }
`;

// Apply animation only when the logo changes
const LogoWrapper = styled.div<{ $isShaking: boolean }>`
  position: relative;
  width: 13rem;
  height: 13rem;
  border-radius: 2rem;
  overflow: hidden;

  ${({ $isShaking }) =>
    $isShaking &&
    css`
      animation: ${shake} 0.1s ease-in-out;
    `}

  @media (max-width: 768px) {
    width: 10rem;
    height: 10rem;
  }
`;

const logos = [
  "Across the Spider-Verse 3.png",
  "Agatha All Along.png",
  "Ant-Man and the Wasp Quantumania.gif",
  "Daredevil Born Again.png",
  "Deadpool & Wolverine.gif",
  "Eternals.png",
  "Guardians of the Galaxy Vol 3.png",
  "Hawkeye (2).png",
  "Hellfire Gala 4.png",
  "Helstrom.png",
  "Loki 1.png",
  "Moon Knight.png",
  "Ms Marvel Kamala 1 sticker.gif",
  "Multiverse of Madness.png",
  "Pride 2024.png",
  "Rivals.gif",
  "Secret Invasion 2.jpg",
  "The Marvels.gif",
  "Venom 3.png",
  "Werewolf by Night.gif",
  "What If.png",
  "X-Men 97.png",
];

const Logo = ({
  src,
  alt,
  isShaking,
}: {
  src: string;
  alt: string;
  isShaking: boolean;
}) => (
  <LogoWrapper $isShaking={isShaking}>
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

export default function Home() {
  const [logo, setLogo] = useState("/img/logo.svg");
  const [isShaking, setIsShaking] = useState(false);
  const [filteredLogos, setFilteredLogos] = useState<string[]>(logos);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const updateLogos = () => {
      const isMobile =
        window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
      setFilteredLogos(
        isMobile ? logos.filter((logo) => !logo.endsWith(".gif")) : logos
      );
      console.log("Window width:", window.innerWidth);
      console.log("User agent:", navigator.userAgent);
      console.log("Is Mobile?", isMobile);
      console.log(logos.filter((logo) => !logo.endsWith(".gif")));
      console.log(filteredLogos);
    };

    updateLogos();
    window.addEventListener("resize", updateLogos);
    return () => window.removeEventListener("resize", updateLogos);
  }, [logo]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleLogoChange = () => {
      console.log(filteredLogos);
      const randomLogo =
        filteredLogos[Math.floor(Math.random() * filteredLogos.length)];
      if (randomLogo !== logo) {
        setIsShaking(true);
        setLogo(`/img/logos/${randomLogo}`);
        setTimeout(() => {
          setIsShaking(false);
        }, 150);
      } else {
        handleLogoChange();
      }
    };

    const logoElement = document.querySelector(".logo");
    if (logoElement) {
      logoElement.addEventListener("mouseover", handleLogoChange);
      logoElement.addEventListener("touchstart", handleLogoChange);
      return () => {
        logoElement.removeEventListener("mouseover", handleLogoChange);
        logoElement.removeEventListener("touchstart", handleLogoChange);
      };
    }
  }, [filteredLogos]);

  return (
    <ContentWrapper showNavbar={false} showFooter={false}>
      <CentreContent>
        <BodyWrapper>
          <Logo src={logo} alt="Marvel Discord Logo" isShaking={isShaking} />
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
              <Button href="/gallery">View the gallery</Button>
            </Buttons>
          </TextWrapper>
        </BodyWrapper>
      </CentreContent>
    </ContentWrapper>
  );
}
