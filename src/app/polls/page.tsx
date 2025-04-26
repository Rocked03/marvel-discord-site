"use client";

import { getPolls } from "@/api/polls/polls";
import { getTags } from "@/api/polls/tags";
import { PollCard } from "@/components/polls/poll";
import { getContrastColorFromInt, intToColorHex } from "@/utils";
import type { Meta, Poll, Tag } from "@jocasta-polls-api";
import { Box, Flex, Select, TextField } from "@radix-ui/themes";
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

const TagSelectContainer = styled(Box)`
  height: 100%;
`;

const TagSelect = styled(Select.Root)``;

const TagSelectTrigger = styled(Select.Trigger)`
  border-radius: var(--radius-3);
  height: 100%;
`;

const TagSelectItem = styled(Select.Item)<{
  backgroundColor: string;
  textColor?: string;
}>`
  &[data-highlighted] {
    background-color: ${({ backgroundColor }) => backgroundColor};
    ${({ textColor }) => textColor && `color: ${textColor};`}
  }
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

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { polls, meta } = await getPolls({
          search: searchValue,
          page: page,
          tag: selectedTag ?? undefined,
        });
        setPolls((prevPolls) => [...prevPolls, ...polls]);
        setMeta(meta);
        setPage(meta.page);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolls();
  }, [searchValue, page, selectedTag]);

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

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
    setPolls([]);
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

        <TagSelectContainer>
          <TagSelect
            defaultValue="all"
            onValueChange={(value) => {
              setSelectedTag(value === "all" ? null : Number(value));
              setPage(1);
              setPolls([]);
            }}
          >
            <TagSelectTrigger aria-label="Filter by tag">
              {selectedTag ? tags[selectedTag].name : "All tags"}
            </TagSelectTrigger>
            <Select.Content>
              <Select.Item value="all">All tags</Select.Item>
              <Select.Separator />
              {tagsOrder.map((tag) => {
                const tagColor = tags[tag].colour ? tags[tag].colour : null;
                const backgroundColor = tagColor
                  ? intToColorHex(tagColor)
                  : "var(--red-9)";
                const textColor = tagColor
                  ? getContrastColorFromInt(tagColor)
                  : undefined;

                return (
                  <TagSelectItem
                    key={tag}
                    value={tag.toString()}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                  >
                    {tags[Number(tag)].name}
                  </TagSelectItem>
                );
              })}
            </Select.Content>
          </TagSelect>
        </TagSelectContainer>
      </SearchContainer>

      {polls && tags && Object.keys(tags).length > 0 && (
        <FullWidthScroll>
          <InfiniteScroll
            dataLength={polls.length}
            next={async () => {
              meta?.nextPage && setPage(meta.nextPage);
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
