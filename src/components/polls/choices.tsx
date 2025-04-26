import { intToColorHex } from "@/utils";
import { Spacer } from "@/utils/styled";
import type { Poll, Tag } from "@jocasta-polls-api";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { TitleText } from "../titleText";
import { useIsMobile } from "@/utils/isMobile";

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
  width: ${({ $percentage }) => `${$percentage}%`};
`;

const ChoiceLabel = styled(Heading)`
  width: 1rem;
`;

const PercentLabel = styled(TitleText)`
  color: var(--gray-a11);
`;

export function Choices({ poll, tag }: { poll: Poll; tag: Tag }) {
  const isMobile = useIsMobile();

  const totalVotes = poll.votes.reduce((acc, vote) => acc + vote, 0);

  const percentageVotes = poll.votes.map((vote) => {
    if (totalVotes === 0) return 0;
    return Number(((vote / totalVotes) * 100).toFixed(0));
  });

  function relativePercentage(percentage: number) {
    return (percentage / Math.max(...percentageVotes)) * 100;
  }

  return (
    <Container>
      {poll.choices.map((choice, index) => (
        <Flex key={ChoiceLabelMap[index + 1]} gap="2" align="center">
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
                {percentageVotes[index]}%
              </PercentLabel>
            </Flex>

            <BarContainer>
              <BarLine
                $percentage={relativePercentage(percentageVotes[index])}
                $color={tag.colour ? intToColorHex(tag.colour) : undefined}
              />
            </BarContainer>
          </Flex>
        </Flex>
      ))}
    </Container>
  );
}
