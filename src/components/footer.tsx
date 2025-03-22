"use client";

import styled from "styled-components";

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  font-size: 0.7rem;
  font-weight: 100;
  margin-block: 2rem;
`;

export default function Footer() {
  return (
    <StyledFooter>
      &copy; {new Date().getFullYear()} Marvel Discord. All rights reserved.
    </StyledFooter>
  );
}
