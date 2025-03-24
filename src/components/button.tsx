import styled from "styled-components";

interface ButtonProps {
  $isActive?: boolean;
}

export const Button = styled.button<ButtonProps>`
  align-items: center;
  border-radius: 0.5rem;
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  padding-block: 0.2rem;
  padding-inline: 1.2rem;
  transition: background-color 0.2s ease;
  width: auto;

  background-color: ${({ $isActive }) =>
    $isActive ? "rgba(var(--foreground-rgb), 0.2)" : "transparent"};

  &:hover {
    background-color: rgba(var(--foreground-rgb), 0.3);
  }
`;

export const LinkButton = styled(Button).attrs({ as: "a" })`
  text-decoration: none;
`;
