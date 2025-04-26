import type { Poll, Tag } from "@jocasta-polls-api";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { Choices } from "./choices";
import { intToColorHex } from "@/utils";

const CardBox = styled(Box)`
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

const ImageContainer = styled(Container)`
  margin-block: 1rem;
  max-width: var(--container-3);
`;

const CardTitleBlock = styled(Flex)`
  width: 100%;
`;

const Description = styled(Text)`
  color: var(--gray-a12);
  letter-spacing: 0.02rem;
`;

const Header = styled(Flex)`
  width: 100%;
`;

const TagPill = styled(Text)<{ tag?: Tag }>`
  background-color: ${({ tag }) =>
    tag?.colour ? intToColorHex(tag.colour) : "var(--red-9)"};
  border-radius: 100rem;
  font-size: var(--font-size-1);
  padding-block: 0.3rem;
  padding-inline: 0.5rem;
  font-weight: 500;

  span {
    /*
    * Ensure contrast of button label against background. The color property
    * should match that of the background it sits against.
    *
    * From https://robinrendle.com/the-cascade/015-context-aware-colors
    */
    color: ${({ tag }) =>
      tag?.colour ? intToColorHex(tag.colour) : "var(--red-9)"};
    filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
    mix-blend-mode: luminosity;
  }
`;

export function PollCard({ poll, tag }: { poll: Poll; tag: Tag }) {
  return (
    <CardBox>
      <Flex direction="column" gap="3" align="center" justify="start">
        <Header align="start">
          <TagPill trim="both" tag={tag}>
            <span>{tag.name}</span>
          </TagPill>
        </Header>

        <CardTitleBlock direction="column" gap="1" align="start">
          <Heading size="7" weight="medium" align="left">
            {poll.question}
          </Heading>
          {poll.description && (
            <Description size="2">{poll.description}</Description>
          )}
        </CardTitleBlock>

        <Choices poll={poll} tag={tag} />

        {poll.image && (
          <ImageContainer>
            <PollImage src={poll.image} alt={poll.question} />
          </ImageContainer>
        )}
      </Flex>
    </CardBox>
  );
}
