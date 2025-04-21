"use client";

import { getPolls } from "@/api/polls/polls";
import type { Meta, Poll } from "@marvel-discord-api-types";
import { Flex, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import styled from "styled-components";

const SearchBar = styled(TextField.Root)`
  width: 100%;
`;

export default function PollsHome() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { polls, meta } = await getPolls();
        setPolls(polls);
        setMeta(meta);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolls();
  }, []);

  return (
    <Flex direction="column" gap="4" align="center" justify="center">
      <SearchBar placeholder="Search the docs…" size="3">
        <TextField.Slot>:o</TextField.Slot>
      </SearchBar>
      {polls && polls.length > 0 && (
        <ul>
          {polls.map((poll) => (
            <li key={poll.id}>{poll.question}</li>
          ))}
        </ul>
      )}
    </Flex>
  );
}
