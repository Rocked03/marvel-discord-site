"use client";

import { Flex, TextField } from "@radix-ui/themes";
import styled from "styled-components";

const SearchBar = styled(TextField.Root)`
  width: 100%;
`;

export default function PollsHome() {
  return (
    <Flex direction="column" gap="4" align="center" justify="center">
      <SearchBar placeholder="Search the docs…" size="3">
        <TextField.Slot>:o</TextField.Slot>
      </SearchBar>
    </Flex>
  );
}
