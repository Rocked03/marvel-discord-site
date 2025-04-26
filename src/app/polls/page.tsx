"use client";

import { getPolls } from "@/api/polls/polls";
import { getTags } from "@/api/polls/tags";
import { PollCard } from "@/components/polls/poll";
import type { Meta, Poll, Tag } from "@jocasta-polls-api";
import { Flex, TextField } from "@radix-ui/themes";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

const SearchBar = styled(TextField.Root)`
  width: 100%;
`;

const FullWidthScroll = styled.div`
  width: 100%;
`;

const PollCardContainer = styled(Flex)`
  width: 100%;
`;

const ClearButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0;
`;

export default function PollsHome() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tags, setTags] = useState<Record<number, Tag>>({});

  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { polls, meta } = await getPolls({
          search: searchValue,
          page: page,
        });
        setPolls((prevPolls) => [...prevPolls, ...polls]);
        setMeta(meta);
        setPage(meta.page);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolls();
  }, [searchValue, page]);

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

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
    setPolls([]);
  };

  return (
    <Flex direction="column" gap="4" align="center" justify="center">
      <SearchBar
        placeholder="Search polls"
        size="3"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
      >
        <TextField.Slot>
          <Search size={20} />
        </TextField.Slot>
        {searchValue && (
          <TextField.Slot>
            <ClearButton
              type="button"
              onClick={() => {
                handleSearch("");
              }}
            >
              <X size={20} />
            </ClearButton>
          </TextField.Slot>
        )}
        {meta && <TextField.Slot>{meta.total} results</TextField.Slot>}
      </SearchBar>

      {polls && tags && Object.keys(tags).length > 0 && (
        <FullWidthScroll>
          <InfiniteScroll
            dataLength={polls.length}
            next={async () => {
              meta?.nextPage && setPage(meta.nextPage);
            }}
            hasMore={meta ? meta.page < meta.totalPages : false}
            loader={<h4>Loading...</h4>}
          >
            <PollCardContainer
              direction="column"
              gap="4"
              align="center"
              justify="center"
            >
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} tag={tags[poll.tag]} />
              ))}
            </PollCardContainer>
          </InfiniteScroll>
        </FullWidthScroll>
      )}
    </Flex>
  );
}
