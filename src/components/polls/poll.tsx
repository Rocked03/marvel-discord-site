import type { Poll, PollInfo, Tag } from "@jocasta-polls-api";
import {
  Container,
  Flex,
  Heading,
  Text,
  Link,
  Skeleton,
  TextField,
} from "@radix-ui/themes";
import styled from "styled-components";
import { Choices, ChoicesSkeleton } from "./choices";
import { useState, type ComponentProps } from "react";
import {
  PollCardHeader,
  PollCardHeaderEditable,
  PollCardHeaderSkeleton,
} from "./cardHeader";
import { useIsMobile } from "@/utils/isMobile";
import {
  cleanUrlSafeString,
  filterDescriptionWithRegex,
  pollDescriptionAnonymousAuthorshipRegex,
  pollDescriptionArtRegex,
  pollDescriptionAuthorshipRegex,
  randomText,
  trimRunningStringMultiLine,
  trimRunningStringSingleLine,
} from "@/utils";
import { AutoGrowingTextAreaStyled } from "./autoGrowingRadixTextArea";
import { Image, ImageOff } from "lucide-react";

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

const QuestionEditable = styled(AutoGrowingTextAreaStyled)<{
  $isMobile: boolean;
}>`
  ${({ $isMobile }) =>
    `
      min-height: var(${
        $isMobile ? "--heading-line-height-5" : "--heading-line-height-7"
      });
    `}

  > textarea {
    font-weight: var(--font-weight-medium);

    ${({ $isMobile }) => `
      font-size: var(${$isMobile ? "--font-size-5" : "--font-size-7"});
      letter-spacing: calc(var(${
        $isMobile ? "--letter-spacing-5" : "--letter-spacing-7"
      }) + var(--heading-letter-spacing));
      `}
`;

const DescriptionContainer = styled(Flex)`
  width: 100%;
`;

const DescriptionStyled = styled(Text)`
  color: var(--gray-a12);
  letter-spacing: 0.02rem;
`;

const DescriptionEditable = styled(AutoGrowingTextAreaStyled)`
  min-height: var(--line-height-2);

  > textarea {
    letter-spacing: 0.02rem;
  }
`;

const ImageUrlInput = styled(TextField.Root)`
  min-width: 50%;
  background-color: var(--gray-a2);
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
  editable = false,
}: {
  poll: Poll;
  tag?: Tag;
  guild: PollInfo;
  userVote?: number;
  setUserVote?: (vote: number | undefined) => void;
  editable?: boolean;
}) {
  const isMobile = useIsMobile();
  const [votes, setVotes] = useState(poll.votes);

  const [questionText, setQuestionText] = useState(poll.question);
  const [descriptionText, setDescriptionText] = useState(
    filterDescriptionWithRegex(poll.description) || ""
  );
  const [imageUrl, setImageUrl] = useState(poll.image || "");
  const [imageError, setImageError] = useState(false);
  const [currentTag, setCurrentTag] = useState(tag);

  const filteredDescription = filterDescriptionWithRegex(poll.description);

  function handleQuestionChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuestionText(trimRunningStringSingleLine(event.target.value));
  }

  function handleDescriptionChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setDescriptionText(trimRunningStringMultiLine(event.target.value));
  }

  function handleImageUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setImageUrl(cleanUrlSafeString(event.target.value));
    setImageError(false);
  }

  return (
    <CardBox direction="column" gap="3" align="center" justify="start">
      {editable ? (
        <PollCardHeaderEditable
          poll={poll}
          tag={currentTag}
          setTag={setCurrentTag}
          guild={guild}
          votes={votes}
        />
      ) : (
        <PollCardHeader poll={poll} tag={tag} guild={guild} votes={votes} />
      )}

      <CardTitleBlock direction="column" gap="1" align="start">
        {editable ? (
          <>
            <QuestionEditable
              $isMobile={isMobile}
              placeholder="Question"
              value={questionText}
              onChange={handleQuestionChange}
              onBlur={(e) => setQuestionText(e.target.value.trim())}
            />
            <DescriptionEditable
              placeholder="Description"
              value={descriptionText}
              onChange={handleDescriptionChange}
              onBlur={(e) => setDescriptionText(e.target.value.trim())}
            />
          </>
        ) : (
          <>
            <Question $isMobile={isMobile}>{poll.question}</Question>
            {filteredDescription && (
              <Description text={filteredDescription} size="2" align="left" />
            )}
          </>
        )}
      </CardTitleBlock>

      <Choices
        poll={poll}
        tag={editable ? currentTag : tag}
        votes={votes}
        setVotes={editable ? undefined : setVotes}
        userVote={editable ? undefined : userVote}
        setUserVote={editable ? undefined : setUserVote}
        editable={editable}
      />

      {imageUrl && !imageError && (
        <ImageContainer>
          <PollImage
            src={imageUrl}
            alt={poll.question}
            onError={editable ? () => setImageError(true) : undefined}
            onLoad={editable ? () => setImageError(false) : undefined}
          />
        </ImageContainer>
      )}

      {editable && (
        <ImageUrlInput
          type="text"
          placeholder="Image URL"
          size="2"
          value={imageUrl}
          onChange={handleImageUrlChange}
          onBlur={(e) => setImageUrl(e.target.value.trim())}
        >
          <TextField.Slot>
            {!imageError ? <Image /> : <ImageOff />}
          </TextField.Slot>
        </ImageUrlInput>
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
