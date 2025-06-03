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
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { PollCardHeader, PollCardHeaderSkeleton } from "./cardHeader";
import { useIsMobile } from "@/utils/isMobile";
import {
  cleanUrlSafeString,
  extractDescriptionWithRegex,
  filterDescriptionWithRegex,
  randomText,
  trimRunningStringMultiLine,
  trimRunningStringSingleLine,
} from "@/utils";
import { AutoGrowingTextAreaStyled } from "./autoGrowingRadixTextArea";
import { Image, ImageOff, Save } from "lucide-react";
import { useFirstRenderResetOnCondition } from "@/utils/useFirstRender";

const CardBox = styled(Flex)<{ $color?: string; $isEdited?: boolean }>`
  background-color: var(--gray-a3);
  border-radius: var(--radius-3);
  padding: 1.5rem;
  transition: box-shadow 0.2s ease-in-out;
  transition: outline 0.2s ease-in-out;
  width: 100%;
  ${({ $color, $isEdited }) =>
    `outline: 0.2rem ${$isEdited ? "dashed" : "solid"} ${
      $color
        ? `rgba(${$color}, ${$isEdited ? "1" : "0"})`
        : "var(--color-background)"
    };`}

  &:hover {
    ${({ $color, $isEdited }) =>
      $color &&
      `
        box-shadow: 0 0 3rem rgba(${$color}, 0.1);
        outline: 0.2rem ${$isEdited ? "dashed" : "solid"} rgba(${$color}, 1);
      `}
  }
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
  flex: 1;

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
  updatePoll,
}: {
  poll: Poll;
  tag?: Tag;
  guild: PollInfo;
  userVote?: number;
  setUserVote?: (vote: number | undefined) => void;
  editable?: boolean;
  updatePoll?: (poll: Poll, isEdited: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [votes, setVotes] = useState(poll.votes);

  const originalPoll = useRef(poll);
  const originalTag = useRef(tag);
  const [isEdited, setIsEdited] = useState(false);

  const [questionText, setQuestionText] = useState(poll.question);
  const [descriptionText, setDescriptionText] = useState(
    filterDescriptionWithRegex(poll.description) || ""
  );
  const [descriptionAdditionalText, setDescriptionAdditionalText] = useState(
    extractDescriptionWithRegex(poll.description) || ""
  );
  const [imageUrl, setImageUrl] = useState(poll.image || "");
  const [imageError, setImageError] = useState(false);
  const [currentTag, setCurrentTag] = useState(tag);
  const [choices, setChoices] = useState(poll.choices);
  const [dateTime, setDateTime] = useState(poll.time);

  const filteredDescription = filterDescriptionWithRegex(poll.description);

  const isFirstRender = useFirstRenderResetOnCondition(editable);

  function checkIsEdited() {
    const questionChanged =
      questionText.trim() !== originalPoll.current.question;
    const descriptionChanged =
      descriptionText.trim() !==
      (filterDescriptionWithRegex(originalPoll.current.description) || "");
    const descriptionAdditionalChanged =
      descriptionAdditionalText.trim() !==
      (extractDescriptionWithRegex(originalPoll.current.description) || "");
    const imageChanged = imageUrl.trim() !== (originalPoll.current.image || "");
    const tagChanged = currentTag?.tag !== originalTag.current?.tag;
    const choicesChanged =
      choices.length !== originalPoll.current.choices.length ||
      choices.some(
        (choice, index) => choice !== originalPoll.current.choices[index]
      );
    const dateTimeChanged = dateTime !== originalPoll.current.time;

    return (
      questionChanged ||
      descriptionChanged ||
      descriptionAdditionalChanged ||
      imageChanged ||
      tagChanged ||
      choicesChanged ||
      dateTimeChanged
    );
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!editable) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const concatenatedDescription =
      `${descriptionText}\n${descriptionAdditionalText}`.trim();

    const updatedPoll: Poll = {
      ...poll,
      question: questionText.trim(),
      description: concatenatedDescription || null,
      image: imageUrl.trim() || null,
      tag: currentTag?.tag ?? 0,
      choices: choices,
      time: dateTime,
    };

    const isEdited = checkIsEdited();
    setIsEdited(isEdited);
    updatePoll?.(updatedPoll, isEdited);
  }, [questionText, descriptionText, imageUrl, currentTag, choices, dateTime]);

  function handleQuestionChange(question: string) {
    setQuestionText(trimRunningStringSingleLine(question));
  }

  function handleDescriptionChange(description: string) {
    setDescriptionText(trimRunningStringMultiLine(description));
  }

  function handleImageUrlChange(url: string) {
    setImageUrl(cleanUrlSafeString(url));
    setImageError(false);
  }

  function handleChoicesChange(newChoices: Poll["choices"]) {
    setChoices(newChoices);
  }

  function handleTimeChange(newDateTime: Poll["time"]) {
    setDateTime(newDateTime);
  }

  const colorRgb = currentTag?.colour
    ? [
        (currentTag.colour >> 16) & 0xff, // Red
        (currentTag.colour >> 8) & 0xff, // Green
        currentTag.colour & 0xff, // Blue
      ].join(", ")
    : undefined;

  return (
    <CardBox
      direction="column"
      gap="3"
      align="center"
      justify="start"
      $color={colorRgb}
      $isEdited={isEdited}
    >
      <PollCardHeader
        poll={poll}
        tag={editable ? currentTag : tag}
        setTag={editable ? setCurrentTag : undefined}
        guild={guild}
        votes={votes}
        editable={editable}
        handleTimeChange={editable ? handleTimeChange : undefined}
        description={descriptionAdditionalText}
        handleDescriptionChange={
          editable ? setDescriptionAdditionalText : undefined
        }
      />

      <CardTitleBlock direction="column" gap="1" align="start">
        {editable ? (
          <>
            <Flex
              direction="row"
              gap="2"
              align="start"
              justify="start"
              style={{ width: "100%" }}
            >
              <QuestionEditable
                $isMobile={isMobile}
                placeholder="Question"
                value={questionText}
                onChange={(e) => handleQuestionChange(e.target.value)}
                onBlur={(e) => setQuestionText(e.target.value.trim())}
              />
              {isEdited && <Save size={32} />}
            </Flex>
            <DescriptionEditable
              placeholder="Description"
              value={descriptionText}
              onChange={(e) => handleDescriptionChange(e.target.value)}
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
        handleChoicesChange={editable ? handleChoicesChange : undefined}
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
          onChange={(e) => handleImageUrlChange(e.target.value)}
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
