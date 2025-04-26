import type { Poll, Tag } from "@jocasta-polls-api";
import { Box, Container, Flex, Heading, Text, Link } from "@radix-ui/themes";
import styled from "styled-components";
import { Choices } from "./choices";
import type { ComponentProps } from "react";
import { PollCardHeader } from "./cardHeader";
import { useIsMobile } from "@/utils/isMobile";

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

export function PollCard({ poll, tag }: { poll: Poll; tag: Tag }) {
  const isMobile = useIsMobile();

  return (
    <CardBox>
      <Flex direction="column" gap="3" align="center" justify="start">
        <PollCardHeader poll={poll} tag={tag} />

        <CardTitleBlock direction="column" gap="1" align="start">
          <Heading size={isMobile ? "5" : "7"} weight="medium" align="left">
            {poll.question}
          </Heading>
          {poll.description && (
            <Description text={poll.description} size="2" align="left" />
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
