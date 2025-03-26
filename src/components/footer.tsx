"use client";

import styled from "styled-components";

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-size: 0.7rem;
  font-weight: 500;
  gap: 2rem;
  justify-content: center;
  letter-spacing: 0.05rem;
  margin-block: 2rem;
  width: 100%;
`;

export default function Footer() {
  return (
    <StyledFooter>
      &copy; {new Date().getFullYear()} Marvel Discord. All rights reserved.
    </StyledFooter>
  );
}
