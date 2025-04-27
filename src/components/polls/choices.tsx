import { intToColorHex, randomText } from "@/utils";
import { Spacer } from "@/utils/styled";
import type { Poll, Tag } from "@jocasta-polls-api";
import { Box, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import styled, { css, keyframes } from "styled-components";
import { TitleText } from "../titleText";
import { useIsMobile } from "@/utils/isMobile";
import type { ComponentProps } from "react";
import { CircleCheckBig } from "lucide-react";

const ChoiceLabelMap: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
};

const Container = styled(Box)`
  border-color: var(--gray-a3);
  border-radius: var(--radius-3);
  border-style: solid;
  border-width: 0.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  width: 100%;
`;

const ChoiceContainerButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ChoiceContainerInner = styled(Flex).attrs({
  gap: "2",
  align: "center",
})``;

const BarContainer = styled.div`
  background-color: var(--gray-a5);
  border-radius: 100rem;
  height: 0.4rem;
  width: 100%;
`;

const BarLine = styled.div<{
  $percentage: number;
  $color?: string;
  $isChecked?: boolean;
}>`
  background-color: ${({ $color }) => $color || "var(--red-9)"};
  border-radius: 100rem;
  height: 100%;
  opacity: ${({ $isChecked }) => ($isChecked ? 0.95 : 0.75)};
  transition: opacity 0.1s ease-in-out, width 0.3s ease-in-out;
  width: ${({ $percentage }) => `${$percentage}%`};

  ${ChoiceContainerButton}:hover & {
    opacity: 1;
  }
`;

const ChoiceLabel = styled(Heading)`
  opacity: 0.75;
  transition: opacity 0.1s ease-in-out;
  width: 1rem;

  ${ChoiceContainerButton}:hover & {
    opacity: 1;
  }
`;

const ChoiceText = styled(Text)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-align: left;
`;

const scaleUpDown = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05); /* Slightly bigger */
  }
  100% {
    transform: scale(1); /* Back to normal size */
  }
`;

const ChoiceCheck = styled(CircleCheckBig)<{ $isChecked: boolean }>`
  display: ${({ $isChecked }) => ($isChecked ? "block" : "none")};

  animation: ${({ $isChecked }) =>
    $isChecked
      ? css`
          ${scaleUpDown} 0.15s ease-in-out
        `
      : "none"};
`;

const PercentLabel = styled(TitleText)`
  color: var(--gray-a11);
`;

function ChoiceContainer({
  children,
  ...props
}: {
  children: React.ReactNode;
} & ComponentProps<"button">) {
  return (
    <ChoiceContainerButton {...props}>
      <ChoiceContainerInner>{children}</ChoiceContainerInner>
    </ChoiceContainerButton>
  );
}

export function Choices({
  poll,
  tag,
  votes,
  setVotes,
  userVote,
  setUserVote,
}: {
  poll: Poll;
  tag: Tag;
  votes: Poll["votes"];
  setVotes: (votes: Poll["votes"]) => void;
  userVote: number | undefined;
  setUserVote: (vote: number | undefined) => void;
}) {
  const isMobile = useIsMobile();

  const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

  const percentageVotes = votes.map((vote) => {
    if (totalVotes === 0) return 0;
    return Number((vote / totalVotes) * 100);
  });

  function relativePercentage(percentage: number) {
    return (percentage / Math.max(...percentageVotes)) * 100;
  }

  function handleVote(index: number) {
    let choice: number | undefined = index;
    if (userVote === index) {
      choice = undefined;
    }

    const updatedVotes = [...votes];
    if (choice === undefined || userVote !== undefined) {
      updatedVotes[index]--;
    }

    if (choice !== undefined) {
      updatedVotes[choice]++;
    }

    setVotes(updatedVotes);
    setUserVote(choice);
  }

  return (
    <Container>
      {poll.choices.map((choice, index) => (
        <ChoiceContainer
          key={ChoiceLabelMap[index + 1]}
          onClick={() => handleVote(index)}
        >
          <ChoiceLabel size="4">{ChoiceLabelMap[index + 1]}</ChoiceLabel>

          <Flex gap="1" direction="column" width="100%">
            <Flex gap="1" width="100%" align="end">
              <ChoiceText size={isMobile ? "2" : "3"}>
                {choice}
                <ChoiceCheck
                  size="20"
                  $isChecked={userVote !== undefined && userVote === index}
                />
              </ChoiceText>
              <Spacer />
              <PercentLabel
                size="1"
                title={`${poll.votes[index]} Vote${
                  poll.votes[index] > 1 ? "s" : ""
                }`}
              >
                {percentageVotes[index].toFixed(0)}%
              </PercentLabel>
            </Flex>

            <BarContainer>
              <BarLine
                $percentage={relativePercentage(percentageVotes[index])}
                $color={tag.colour ? intToColorHex(tag.colour) : undefined}
                $isChecked={userVote !== undefined && userVote === index}
              />
            </BarContainer>
          </Flex>
        </ChoiceContainer>
      ))}
    </Container>
  );
}

export function ChoicesSkeleton() {
  const isMobile = useIsMobile();

  return (
    <Container>
      {Array.from({ length: 4 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
        <Flex key={index} gap="2" align="center">
          <Skeleton>
            <ChoiceLabel size="4">{ChoiceLabelMap[index + 1]}</ChoiceLabel>
          </Skeleton>

          <Flex gap="1" direction="column" width="100%">
            <Flex width="100%" align="end">
              <Skeleton>
                <Text size="2">{randomText(5, isMobile ? 20 : 50)}</Text>
              </Skeleton>
              <Spacer />
              <Skeleton>
                <PercentLabel size="1" title="">
                  50%
                </PercentLabel>
              </Skeleton>
            </Flex>

            <Skeleton>
              <BarContainer />
            </Skeleton>
          </Flex>
        </Flex>
      ))}
    </Container>
  );
}
