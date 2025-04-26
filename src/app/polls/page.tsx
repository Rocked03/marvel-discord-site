"use client";

import { getPolls } from "@/api/polls/polls";
import { getTags } from "@/api/polls/tags";
import { PollCard } from "@/components/polls/poll";
import type { Meta, Poll, Tag } from "@jocasta-polls-api";
import { Flex, TextField } from "@radix-ui/themes";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const SearchBar = styled(TextField.Root)`
  width: 100%;
`;

export default function PollsHome() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tags, setTags] = useState<Record<number, Tag>>({});
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { polls, meta } = await getPolls({
          search: searchValue,
        });
        setPolls(polls);
        setMeta(meta);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolls();
  }, [searchValue]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        const tags: Record<number, Tag> = Object.fromEntries(
          response.map((tag) => [tag.tag, tag])
        );
        setTags(tags);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTags();
  }, []);

  return (
    <Flex direction="column" gap="4" align="center" justify="center">
      <SearchBar
        placeholder="Search polls"
        size="3"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      >
        <TextField.Slot>
          <Search size={20} />
        </TextField.Slot>
        {meta && <TextField.Slot>{meta.total} results</TextField.Slot>}
      </SearchBar>

      {polls &&
        polls.length > 0 &&
        tags &&
        Object.keys(tags).length > 0 &&
        polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} tag={tags[poll.tag]} />
        ))}
    </Flex>
  );
}
