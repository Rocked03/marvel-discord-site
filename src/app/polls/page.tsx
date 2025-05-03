"use client";

import { getGuilds } from "@/api/polls/guilds";
import { getPolls } from "@/api/polls/polls";
import { getTags } from "@/api/polls/tags";
import { getUserVotes } from "@/api/polls/votes";
import { PollCard, PollCardSkeleton } from "@/components/polls/poll";
import ScrollToTopButton from "@/components/polls/scrollToTop";
import { PollsSearch } from "@/components/polls/search";
import { updateUrlParameters } from "@/utils";
import { useDebounce } from "@/utils/debouncer";
import type {
  DiscordUserProfile,
  Meta,
  Poll,
  PollInfo,
  Tag,
} from "@jocasta-polls-api";
import { Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import config from "../config/config";
import { getUser } from "@/api/polls/auth";
import { useAuthContext } from "@/contexts/AuthProvider";

const BodyContainer = styled(Flex).attrs({
  direction: "column",
  gap: "4",
  align: "center",
  justify: "center",
})``;

const FullWidthScroll = styled.div`
  width: 100%;
`;

const PollCardContainer = styled(Flex).attrs({
  direction: "column",
  gap: "4",
  align: "center",
  justify: "center",
})`
  width: 100%;
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
  const skeletons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
        <PollCardSkeleton key={index} />
      )),
    []
  );

  return (
    <Suspense
      fallback={
        <BodyContainer>
          <PollsSearch
            handleSearch={() => {}}
            handleTagSelect={() => {}}
            disabled
          />

          <FullWidthScroll>
            <PollCardContainer>{skeletons}</PollCardContainer>
          </FullWidthScroll>
        </BodyContainer>
      }
    >
      <PollsContent skeletons={skeletons} />
    </Suspense>
  );
}

function PollsContent({ skeletons }: { skeletons?: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tags, setTags] = useState<Record<number, Tag>>({});
  const [tagsOrder, setTagsOrder] = useState<number[]>([]);
  const [guilds, setGuilds] = useState<Record<string, PollInfo>>({});
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});

  const { user: discordUserProfile, signOut } = useAuthContext();

  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("search") || ""
  );
  const [page, setPage] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<number | null>(
    Number(searchParams.get("tag")) || null
  );
  const searchParamHasVoted = searchParams.get("hasVoted");
  const [hasVoted, setHasVoted] = useState<boolean | undefined>(
    (searchParamHasVoted !== null && searchParamHasVoted !== "false") ||
      undefined
  );

  const user: {
    id: bigint;
  } = {
    id: BigInt("204778476102877187"),
  };

  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // biome-ignore lint/correctness/useExhaustiveDependencies: User doesn't change
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
          user:
            user && hasVoted !== undefined
              ? {
                  userId: user.id,
                  notVoted: !hasVoted,
                }
              : undefined,
        });
        if (!cancelled) {
          setPolls((prevPolls) => [...prevPolls, ...polls]);
          setMeta(meta);
          setPage(meta.page);

          setLoading(false);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error(err);
        }
      }
    };

    if (page === 1) {
      setLoading(true);
    }
    fetchPolls();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedSearchValue, page, selectedTag, hasVoted]);

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await getGuilds();
        const guilds: Record<string, PollInfo> = Object.fromEntries(
          response.map((guild) => [guild.guild_id, guild])
        );
        setGuilds(guilds);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuilds();
  }, []);

  useEffect(() => {
    const fetchUserVotes = async () => {
      try {
        const response = await getUserVotes(user.id.toString());
        const userVotes: Record<number, number> = Object.fromEntries(
          response.map((vote) => [vote.poll_id, vote.choice])
        );
        setUserVotes(userVotes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserVotes();
  }, [user.id]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset whenever they change
  useEffect(() => {
    setPage(1);
    setPolls([]);
  }, [debouncedSearchValue, selectedTag, hasVoted]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateUrlParameters(router, searchParams, {
      search: value !== "" ? value : null,
    });
  };

  const handleTagSelect = (value: string) => {
    setSelectedTag(value === "all" ? null : Number(value));
    updateUrlParameters(router, searchParams, {
      tag: value === "all" ? null : Number(value),
    });
  };

  useEffect(() => {
    updateUrlParameters(router, searchParams, {
      hasVoted: hasVoted !== undefined ? hasVoted : null,
    });
  }, [hasVoted, router, searchParams]);

  function setUserVote(pollId: number, choice: number | undefined) {
    if (choice === undefined) {
      setUserVotes((prevVotes) => {
        const newVotes = { ...prevVotes };
        delete newVotes[pollId];
        return newVotes;
      });
      return;
    }
    setUserVotes((prevVotes) => ({
      ...prevVotes,
      [pollId]: choice,
    }));
  }

  const dataExists =
    polls &&
    tags &&
    guilds &&
    Object.keys(tags).length > 0 &&
    Object.keys(guilds).length > 0;

  return (
    <>
      <ScrollToTopButton />
      <BodyContainer>
        <PollsSearch
          handleSearch={handleSearch}
          handleTagSelect={handleTagSelect}
          searchValue={searchValue}
          meta={meta}
          tags={tags}
          tagsOrder={tagsOrder}
          selectedTag={selectedTag}
          hasVoted={hasVoted}
          setHasVoted={setHasVoted}
          user={user}
        />

        <FullWidthScroll>
          {dataExists && !loading ? (
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
              <PollCardContainer>
                {polls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    tag={tags[Number(poll.tag)]}
                    guild={guilds[poll.guild_id.toString()]}
                    userVote={userVotes[poll.id]}
                    setUserVote={(choice: number | undefined) =>
                      setUserVote(poll.id, choice)
                    }
                  />
                ))}
              </PollCardContainer>
            </InfiniteScroll>
          ) : (
            <PollCardContainer>{skeletons}</PollCardContainer>
          )}
        </FullWidthScroll>
      </BodyContainer>
    </>
  );
}
