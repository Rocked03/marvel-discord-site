import type { Poll, Tag } from "@jocasta-polls-api";
import { Box, Container, Flex, Heading, Text, Link } from "@radix-ui/themes";
import styled from "styled-components";
import { Choices } from "./choices";
import { intToColorHex } from "@/utils";
import { Spacer } from "@/utils/styled";
import { Calendar, ExternalLink, type LucideProps, Vote } from "lucide-react";
import { cloneElement, isValidElement, type ReactElement } from "react";

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

const HeaderTextStyled = styled(Text).attrs({ size: "1" })`
  color: var(--gray-a11);
`;

function HeaderText({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const styledIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<LucideProps>, {
        size: 16,
        color: "var(--gray-a11)",
        strokeWidth: 2,
      })
    : icon;

  return (
    <Flex gap="1" align="center">
      {styledIcon}
      <HeaderTextStyled>{children}</HeaderTextStyled>
    </Flex>
  );
}

function HeaderTextWithLink({
  icon,
  children,
  href,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <HeaderText icon={icon}>{children}</HeaderText>
    </Link>
  );
}

export function PollCard({ poll, tag }: { poll: Poll; tag: Tag }) {
  const totalVotes = poll.votes.reduce((acc, vote) => acc + vote, 0);

  return (
    <CardBox>
      <Flex direction="column" gap="3" align="center" justify="start">
        <Header align="center" justify="start" gap="3">
          <TagPill trim="both" size="1" tag={tag}>
            <span>
              {tag.name}
              {poll.num && ` • #${poll.num}`}
            </span>
          </TagPill>

          <HeaderText icon={<Calendar />}>
            {poll.time
              ? new Date(poll.time).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "No date set."}
          </HeaderText>

          <HeaderText icon={<Vote />}>
            {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
          </HeaderText>

          <Spacer />

          {poll.published && (
            <HeaderTextWithLink
              icon={<ExternalLink />}
              href={
                poll.message_id
                  ? `https://discord.com/channels/${poll.guild_id}/${tag.channel_id}/${poll.message_id}`
                  : ""
              }
            >
              {poll.thread_question ? "Discuss in Discord" : "Open in Discord"}
            </HeaderTextWithLink>
          )}
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
