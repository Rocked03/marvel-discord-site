import Navbar from "./navbar";
import styled from "styled-components";
import type { ReactNode } from "react";
import Footer from "./footer";

export const ContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-inline: auto;
  max-width: 80rem;
  padding-inline: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding-inline: 2rem;
  }
`;

const ContentFull = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface ContentWrapperProps {
  showNavbar?: boolean;
  showFooter?: boolean;
  children: ReactNode;
}

export function ContentWrapper({
  showNavbar = true,
  showFooter = true,
  children,
}: ContentWrapperProps) {
  return (
    <ContentFull>
      {showNavbar && <Navbar />}
      <ContentStyle>{children}</ContentStyle>
      {showFooter && <Footer />}
    </ContentFull>
  );
}
