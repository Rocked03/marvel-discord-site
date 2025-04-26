import { getContrastColorFromInt, getTagColors, intToColorHex } from "@/utils";
import type { Poll, Tag } from "@jocasta-polls-api";
import { Flex, Link, Text } from "@radix-ui/themes";
import { Calendar, ExternalLink, type LucideProps, Vote } from "lucide-react";
import {
  cloneElement,
  type ComponentProps,
  isValidElement,
  type ReactElement,
} from "react";
import styled from "styled-components";
import { TitleText } from "../titleText";

const Header = styled(Flex)`
  flex-wrap: wrap;
  width: 100%;
`;

const Pill = styled(Text).attrs({ size: "1", trim: "both" })`
  border-radius: 100rem;
  font-weight: 500;
  padding-block: 0.3rem;
  padding-inline: 0.5rem;
`;

const TagPill = styled(Pill)<{ $tag?: Tag }>`
  ${({ $tag }) => {
    const { backgroundColor, textColor } = getTagColors($tag);
    return `
      background-color: ${backgroundColor ?? "var(--red-9)"};
      color: ${textColor ?? "#fff"};
    `;
  }}
`;

const NewPill = styled(Pill)`
  background-color: var(--red-9);
  color: #fff;
  box-shadow: 0 0 0.5rem var(--red-9);
`;

const ScrollFlex = styled(Flex)`
  flex-wrap: nowrap;
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
`;

const HeaderTextStyled = styled(TitleText).attrs({ size: "1" })`
  color: var(--gray-a11);
`;

function HeaderText({
  icon,
  children,
  ...props
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
} & ComponentProps<typeof Text>) {
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
      <HeaderTextStyled {...props}>{children}</HeaderTextStyled>
    </Flex>
  );
}

function HeaderTextWithLink({
  icon,
  children,
  href,
  ...props
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href: string;
} & ComponentProps<typeof Text>) {
  return (
    <Link href={href} underline="hover">
      <HeaderText icon={icon} {...props}>
        {children}
      </HeaderText>
    </Link>
  );
}

export function PollCardHeader({ poll, tag }: { poll: Poll; tag: Tag }) {
  const totalVotes = poll.votes.reduce((acc, vote) => acc + vote, 0);

  const isNew = poll.time
    ? new Date(poll.time).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 7 // 7 days
    : false;

  return (
    <Header align="center" justify="start" gap="3">
      {isNew && <NewPill>NEW</NewPill>}

      <TagPill $tag={tag}>
        {tag.name}
        {poll.num && ` • #${poll.num}`}
      </TagPill>

      <ScrollFlex gap="3" align="center" justify="between">
        <Flex gap="3">
          <HeaderText
            icon={<Calendar />}
            title={
              poll.time
                ? new Date(poll.time).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    minute: "2-digit",
                    hour: "2-digit",
                    timeZoneName: "short",
                  })
                : undefined
            }
          >
            {poll.time
              ? new Date(poll.time).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "No date set."}
          </HeaderText>

          <HeaderText icon={<Vote />}>
            {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
          </HeaderText>
        </Flex>

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
      </ScrollFlex>
    </Header>
  );
}
