"use client";

import { getPolls } from "@/api/polls/polls";
import { getTags } from "@/api/polls/tags";
import { PollCard } from "@/components/polls/poll";
import { TagSelect } from "@/components/polls/tagSelect";
import { useDebounce } from "@/utils/debouncer";
import type { Meta, Poll, Tag } from "@jocasta-polls-api";
import { Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

const SearchContainer = styled(Flex)`
  align-items: center;
  height: 3rem;
  width: 100%;
`;

const SearchBar = styled(TextField.Root)`
  border-radius: var(--radius-3);
  flex: 1;
  height: 100%;
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

const LoadingText = styled.h4`
  color: var(--gray-a11);
  font-size: var(--font-size-3);
  font-weight: 500;
  width: 100%;
  text-align: center;
  padding-block: 1rem;
`;

export default function PollsHome() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tags, setTags] = useState<Record<number, Tag>>({});
  const [tagsOrder, setTagsOrder] = useState<number[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const controller = new AbortController();

    let cancelled = false;

    const fetchPolls = async () => {
      try {
        const { polls, meta } = await getPolls({
          search: debouncedSearchValue,
          page: page,
          tag: selectedTag ?? undefined,
          signal: controller.signal,
        });
        if (!cancelled) {
          setPolls((prevPolls) => [...prevPolls, ...polls]);
          setMeta(meta);
          setPage(meta.page);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error(err);
        }
      }
    };

    fetchPolls();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedSearchValue, page, selectedTag]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        const tags: Record<number, Tag> = Object.fromEntries(
          response.map((tag) => [tag.tag, tag])
        );
        const tagsOrder: number[] = response.map((tag) => tag.tag);
        setTags(tags);
        setTagsOrder(tagsOrder);
        console.log(tags);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTags();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset whenever they change
  useEffect(() => {
    setPage(1);
    setPolls([]);
  }, [debouncedSearchValue, selectedTag]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleTagSelect = (value: string) => {
    setSelectedTag(value === "all" ? null : Number(value));
  };

  return (
    <Flex direction="column" gap="4" align="center" justify="center">
      <SearchContainer gap="2" align="center">
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

        <TagSelect
          selectedTag={selectedTag}
          handleTagSelect={handleTagSelect}
          tags={tags}
          tagsOrder={tagsOrder}
        />
      </SearchContainer>

      {polls && tags && Object.keys(tags).length > 0 && (
        <FullWidthScroll>
          <InfiniteScroll
            dataLength={polls.length}
            next={async () => {
              if (meta?.nextPage) {
                setPage(meta.nextPage);
              }
            }}
            hasMore={meta ? meta.page < meta.totalPages : false}
            loader={<LoadingText>Loading...</LoadingText>}
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
