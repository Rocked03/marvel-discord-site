import { intToColorHex, randomText } from "@/utils";
import { Spacer } from "@/utils/styled";
import type { Poll, Tag } from "@jocasta-polls-api";
import { Box, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { TitleText } from "../titleText";
import { useIsMobile } from "@/utils/isMobile";
import type { ComponentProps } from "react";

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

const BarLine = styled.div<{ $percentage: number; $color?: string }>`
  background-color: ${({ $color }) => $color || "var(--red-9)"};
  border-radius: 100rem;
  height: 100%;
  opacity: 0.75;
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
}: {
  poll: Poll;
  tag: Tag;
  votes: Poll["votes"];
  setVotes: (votes: Poll["votes"]) => void;
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

  return (
    <Container>
      {poll.choices.map((choice, index) => (
        <ChoiceContainer
          key={ChoiceLabelMap[index + 1]}
          onClick={() => {
            const updatedVotes = [...votes];
            updatedVotes[index]++;
            setVotes(updatedVotes);
          }}
        >
          <ChoiceLabel size="4">{ChoiceLabelMap[index + 1]}</ChoiceLabel>

          <Flex gap="1" direction="column" width="100%">
            <Flex width="100%" align="end">
              <Text size={isMobile ? "2" : "3"}>{choice}</Text>
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
