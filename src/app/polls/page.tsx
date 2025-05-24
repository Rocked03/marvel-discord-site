"use client";

import { getGuilds } from "@/api/polls/guilds";
import { getPollById, getPolls } from "@/api/polls/polls";
import { getUserVotes } from "@/api/polls/votes";
import { PollCard, PollCardSkeleton } from "@/components/polls/poll";
import ScrollToTopButton from "@/components/polls/scrollToTop";
import { PollsSearch } from "@/components/polls/search";
import { PollSearchType, updateUrlParameters } from "@/utils";
import { useDebounce } from "@/utils/debouncer";
import type { Meta, Poll, PollInfo } from "@jocasta-polls-api";
import { Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useTagContext } from "@/contexts/TagContext";

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

function PollsContent({ skeletons }: { skeletons?: React.ReactNode[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const { tags } = useTagContext();
  const [guilds, setGuilds] = useState<Record<string, PollInfo>>({});
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});

  const { user } = useAuthContext();

  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("search") || ""
  );
  const [searchType, setSearchType] = useState<PollSearchType>(
    PollSearchType.SEARCH
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

  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const controller = new AbortController();

    let cancelled = false;

    const fetchPolls = async () => {
      try {
        if (searchType === PollSearchType.SEARCH) {
          const { polls, meta } = await getPolls({
            search: debouncedSearchValue,
            page: page,
            tag: selectedTag ?? undefined,
            signal: controller.signal,
            user:
              user && hasVoted !== undefined
                ? {
                    userId: BigInt(user.id),
                    notVoted: !hasVoted,
                  }
                : undefined,
          });
          if (!cancelled) {
            setPolls((prevPolls) => [...prevPolls, ...polls]);
            setMeta(meta);
            setPage(meta.page);
          }
        } else {
          try {
            const poll = await getPollById(debouncedSearchValue);
            if (!cancelled) {
              setPolls([poll]);
            }
          } catch {
            setPolls([]);
          } finally {
            setMeta(null);
          }
        }
        setLoading(false);
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
  }, [debouncedSearchValue, page, selectedTag, hasVoted, user, searchType]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Just on start
  useEffect(() => {
    handleSearch(searchValue);
  }, []);

  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!user) {
        setUserVotes({});
        return;
      }
      try {
        const response = await getUserVotes(user.id);
        const userVotes: Record<number, number> = Object.fromEntries(
          response.map((vote) => [vote.poll_id, vote.choice])
        );
        setUserVotes(userVotes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserVotes();
  }, [user]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset whenever they change
  useEffect(() => {
    setPage(1);
    setPolls([]);
  }, [debouncedSearchValue, selectedTag, hasVoted]);

  const handleSearch = (value: string, newSearchType?: PollSearchType) => {
    if (newSearchType !== undefined) {
      setSearchType(newSearchType);
    }

    if (
      value.toLowerCase().startsWith("id:") &&
      searchType === PollSearchType.SEARCH
    ) {
      setSearchType(PollSearchType.ID);
      setSearchValue(value.substring(3).trim());
    } else {
      setSearchValue(value);
    }

    const fullValue = (
      (newSearchType || searchType) === PollSearchType.ID
        ? `id: ${value}`
        : value
    ).trim();
    updateUrlParameters(router, searchParams, {
      search: fullValue !== "" ? fullValue : null,
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
          selectedTag={selectedTag}
          hasVoted={hasVoted}
          setHasVoted={setHasVoted}
          searchType={searchType}
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
                <PollCard
                  poll={{
                    id: 0,
                    question: "",
                    description: "",
                    image: "",
                    votes: [],
                    tag: 0,
                    guild_id: BigInt("281648235557421056"),
                    published: false,
                    active: false,
                    choices: [],
                    time: null,
                    num: null,
                    message_id: null,
                    crosspost_message_ids: [],
                    thread_question: "",
                    show_question: true,
                    show_options: true,
                    show_voting: true,
                    fallback: false,
                  }}
                  guild={guilds["281648235557421056"]}
                  editable
                />
                {polls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    tag={tags[Number(poll.tag)]}
                    guild={guilds[poll.guild_id.toString()]}
                    // editable
                  />
                ))}
              </PollCardContainer>
            </InfiniteScroll>
          ) : (
            <PollCardContainer>
              {searchType === PollSearchType.ID
                ? Array.isArray(skeletons)
                  ? skeletons.slice(0, 1)
                  : []
                : skeletons}
            </PollCardContainer>
          )}
        </FullWidthScroll>
      </BodyContainer>
    </>
  );
}
