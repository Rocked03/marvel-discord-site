import type { Poll, PollInfo, Tag } from "@jocasta-polls-api";
import {
  Container,
  Flex,
  Heading,
  Text,
  Link,
  Skeleton,
} from "@radix-ui/themes";
import styled from "styled-components";
import { Choices, ChoicesSkeleton } from "./choices";
import { useState, type ComponentProps } from "react";
import { PollCardHeader, PollCardHeaderSkeleton } from "./cardHeader";
import { useIsMobile } from "@/utils/isMobile";
import {
  pollDescriptionAnonymousAuthorshipRegex,
  pollDescriptionArtRegex,
  pollDescriptionAuthorshipRegex,
  randomText,
} from "@/utils";

const CardBox = styled(Flex)`
  width: 100%;
  padding: 1.5rem;
  border-radius: var(--radius-3);
  background-color: var(--gray-a3);
`;

const PollImage = styled.img`
  height: auto;
  max-width: 100%;
  object-fit: cover;
  width: 100%;
`;

const PollImageSkeleton = styled(Skeleton)`
  aspect-ratio: 50 / 21;
  border-radius: var(--radius-5);
  display: block;
  height: auto;
  min-height: 0;
  object-fit: cover;
  width: 100%;
`;

const ImageContainer = styled(Container)`
  max-width: var(--container-3);
  width: 100%;
`;

const CardTitleBlock = styled(Flex)`
  width: 100%;
`;

const Question = styled(Heading).attrs<{ $isMobile: boolean }>(
  ({ $isMobile }) => ({
    size: $isMobile ? "5" : "7",
    weight: "medium",
    align: "left",
  })
)``;

const DescriptionContainer = styled(Flex)`
  width: 100%;
`;

const DescriptionStyled = styled(Text)`
  color: var(--gray-a12);
  letter-spacing: 0.02rem;
`;

function Description({
  text,
  ...props
}: {
  text: string;
} & ComponentProps<typeof Text>) {
  const lines = text.split("\n");

  // Simple URL regex
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return (
    <DescriptionContainer direction="column" gap="1">
      {lines.map((line, index) => {
        const parts = line.split(urlRegex);

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: Just text
          <DescriptionStyled key={index} {...props}>
            {parts.map((part) => {
              if (urlRegex.test(part)) {
                return (
                  <Link
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    key={part}
                  >
                    {part}
                  </Link>
                );
              }
              return part;
            })}
          </DescriptionStyled>
        );
      })}
    </DescriptionContainer>
  );
}

export function PollCard({
  poll,
  tag,
  guild,
  userVote,
  setUserVote,
}: {
  poll: Poll;
  tag: Tag;
  guild: PollInfo;
  userVote: number | undefined;
  setUserVote: (vote: number | undefined) => void;
}) {
  const isMobile = useIsMobile();

  const [votes, setVotes] = useState(poll.votes);

  const newDescription = poll.description
    ?.replace(pollDescriptionAuthorshipRegex, "")
    .replace(pollDescriptionAnonymousAuthorshipRegex, "")
    .replace(pollDescriptionArtRegex, "")
    .trim();

  return (
    <CardBox direction="column" gap="3" align="center" justify="start">
      <PollCardHeader poll={poll} tag={tag} guild={guild} votes={votes} />

      <CardTitleBlock direction="column" gap="1" align="start">
        <Question $isMobile={isMobile}>{poll.question}</Question>
        {/* <TextField.Root
          style={{
            fontSize: "var(--font-size-7)",
            fontWeight: "var(--font-weight-medium)",
            padding: 0,
            border: "none",
            background: "transparent",
            outline: "none",
            width: "100%",
          }}
          // value={poll.question}
        /> */}
        {newDescription && (
          <Description text={newDescription} size="2" align="left" />
        )}
      </CardTitleBlock>

      <Choices
        poll={poll}
        tag={tag}
        votes={votes}
        setVotes={setVotes}
        userVote={userVote}
        setUserVote={setUserVote}
      />

      {poll.image && (
        <ImageContainer>
          <PollImage src={poll.image} alt={poll.question} />
        </ImageContainer>
      )}
    </CardBox>
  );
}

export function PollCardSkeleton() {
  const isMobile = useIsMobile();

  return (
    <CardBox direction="column" gap="3" align="center" justify="start">
      <PollCardHeaderSkeleton />

      <CardTitleBlock direction="column" gap="1" align="start">
        <Question $isMobile={isMobile}>
          <Skeleton>{randomText(5, isMobile ? 20 : 50)}</Skeleton>
        </Question>
        <Skeleton>
          <Description text="Loading..." size="2" align="left" />
        </Skeleton>
      </CardTitleBlock>

      <ChoicesSkeleton />

      <ImageContainer>
        <PollImageSkeleton />
      </ImageContainer>
    </CardBox>
  );
}
