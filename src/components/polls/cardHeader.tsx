import {
  getTagColors,
  pollDescriptionAnonymousAuthorshipRegex,
  pollDescriptionArtRegex,
  pollDescriptionAuthorshipRegex,
} from "@/utils";
import type { Poll, PollInfo, Tag } from "@jocasta-polls-api";
import {
  Button,
  Dialog,
  Flex,
  HoverCard,
  Link,
  Skeleton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import {
  Calendar,
  ExternalLink,
  Info,
  type LucideProps,
  MessagesSquare,
  Palette,
  PencilLine,
  Tag as LucideTag,
  Vote,
  Hash,
} from "lucide-react";
import {
  cloneElement,
  type ComponentProps,
  isValidElement,
  type ReactElement,
} from "react";
import styled from "styled-components";
import { TitleText } from "../titleText";
import { useIsMobile } from "@/utils/isMobile";

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

const DialogTooltipText = styled(Text).attrs({
  size: "1",
  color: "gray",
  trim: "both",
})`
  font-variation-settings: "slnt" -10;
`;

function HeaderText({
  icon,
  children,
  ...props
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
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
      {children && <HeaderTextStyled {...props}>{children}</HeaderTextStyled>}
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
    <Link
      href={href}
      underline="hover"
      target="_blank"
      rel="noopener noreferrer"
    >
      <HeaderText icon={icon} {...props}>
        {children}
      </HeaderText>
    </Link>
  );
}

function PollAuthorshipData({ poll }: { poll: Poll }): InfoTag[] {
  let descriptor = "";
  let author = "";

  const match = poll.description?.match(pollDescriptionAuthorshipRegex);

  if (match) {
    descriptor = match[1].trim();
    author = `@${match[2].trim()}`;
  } else {
    const match = poll.description?.match(
      pollDescriptionAnonymousAuthorshipRegex
    );
    if (match) {
      descriptor = match[1].trim();
      author = "Anonymous";
    } else {
      return [];
    }
  }
  return [
    {
      text: author,
      icon: <PencilLine />,
      tooltip: `${descriptor} by`,
    },
  ];
}

function PollArtistData({ poll }: { poll: Poll }): InfoTag[] {
  if (!poll.description) return [];

  const matches = [...poll.description.matchAll(pollDescriptionArtRegex)];

  return matches.map((match) => ({
    text: match[2].trim(),
    icon: <Palette />,
    tooltip: `${match[1].trim()} by`,
  }));
}

interface InfoTag {
  text: string;
  icon: React.ReactNode;
  tooltip?: string;
  mobileOnly?: boolean;
}

function InfoTags({
  poll,
  tag,
  totalVotes,
}: {
  poll: Poll;
  tag: Tag;
  totalVotes: number;
}) {
  const isMobile = useIsMobile();
  const time = poll.time ? new Date(poll.time) : undefined;

  const tags: InfoTag[] = [
    {
      text: tag.name,
      icon: <LucideTag />,
      tooltip: poll.num ? `#${poll.num}` : undefined,
      mobileOnly: true,
    },
    {
      text: time
        ? isMobile
          ? time.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
          : time.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
        : "No date set.",
      icon: <Calendar />,
      tooltip: time
        ? time.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            minute: "2-digit",
            hour: "2-digit",
            timeZoneName: "short",
          })
        : "No date set.",
    },
    {
      text: `${totalVotes} ${totalVotes === 1 ? "Vote" : "Votes"}`,
      icon: <Vote />,
    },
    ...PollAuthorshipData({ poll }),
    ...PollArtistData({ poll }),
    {
      text: poll.id.toString(),
      icon: <Hash />,
      mobileOnly: true,
    },
  ];

  if (!isMobile) {
    return (
      <Flex gap="3" align="center" justify="between">
        {tags.map((tag) => {
          return (
            tag.mobileOnly !== true &&
            (tag.tooltip ? (
              <Tooltip key={tag.text} content={tag.tooltip}>
                <HeaderText icon={tag.icon}>{tag.text}</HeaderText>
              </Tooltip>
            ) : (
              <HeaderText key={tag.text} icon={tag.icon}>
                {tag.text}
              </HeaderText>
            ))
          );
        })}
      </Flex>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost">
          <HeaderText icon={<Info />} />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Poll Info</Dialog.Title>

        <Flex gap="4" direction="column" align="start" justify="start">
          {tags.map((tag) => {
            const styledIcon = isValidElement(tag.icon)
              ? cloneElement(tag.icon as ReactElement<LucideProps>, {
                  size: 26,
                  color: "var(--gray-a11)",
                  strokeWidth: 2,
                })
              : tag.icon;

            return (
              <Flex gap="1" align="center" key={tag.text}>
                {styledIcon}
                <Flex gap="1" align="start" direction="column">
                  <Text size="2">{tag.text}</Text>
                  {tag.tooltip && (
                    <DialogTooltipText>{tag.tooltip}</DialogTooltipText>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function PollCardHeader({
  poll,
  tag,
  guild,
  votes,
}: {
  poll: Poll;
  tag: Tag;
  guild: PollInfo;
  votes: Poll["votes"];
}) {
  const isMobile = useIsMobile();

  const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

  const time = poll.time ? new Date(poll.time) : undefined;
  const isNew = time
    ? time.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 2 // 2 days
    : false;

  const pollLink = poll.message_id
    ? `https://discord.com/channels/${guild.guild_id}/${
        poll.fallback ? guild.fallback_channel_id : tag.channel_id
      }/${poll.message_id}`
    : "";

  return (
    <Header align="center" justify="start" gap="3">
      {isNew && <NewPill>NEW</NewPill>}

      <TagPill $tag={tag}>
        {tag.name}
        {poll.num && ` • #${poll.num}`}
      </TagPill>

      <ScrollFlex gap="3" align="center" justify="between">
        <InfoTags poll={poll} tag={tag} totalVotes={totalVotes} />

        {poll.published && (
          <HeaderTextWithLink
            icon={<ExternalLink />}
            href={pollLink}
            rel="noopener noreferrer"
          >
            {isMobile ? undefined : poll.thread_question ? (
              poll.thread_question !== "def" ? (
                <HoverCard.Root>
                  <HoverCard.Trigger>
                    <Text>Discuss in Discord</Text>
                  </HoverCard.Trigger>
                  <HoverCard.Content side="bottom" align="end">
                    <Link
                      href={pollLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="gray"
                      underline="none"
                    >
                      <Flex gap="2" align="center">
                        <Text size="2">{poll.thread_question}</Text>
                        <MessagesSquare size="1.5rem" />
                      </Flex>
                    </Link>
                  </HoverCard.Content>
                </HoverCard.Root>
              ) : (
                "Discuss in Discord"
              )
            ) : (
              "Open in Discord"
            )}
          </HeaderTextWithLink>
        )}
      </ScrollFlex>
    </Header>
  );
}

export function PollCardHeaderSkeleton() {
  const isMobile = useIsMobile();

  return (
    <Header align="center" justify="start" gap="3">
      <Skeleton>
        <TagPill>Loading...</TagPill>
      </Skeleton>
      <ScrollFlex gap="3" align="center" justify="between">
        <Flex gap="3">
          <HeaderText
            icon={
              <Skeleton>
                <Calendar />
              </Skeleton>
            }
          >
            <Skeleton>Loading...</Skeleton>
          </HeaderText>
          <HeaderText
            icon={
              <Skeleton>
                <Vote />
              </Skeleton>
            }
          >
            <Skeleton>Loading...</Skeleton>
          </HeaderText>
        </Flex>
        <HeaderText
          icon={
            <Skeleton>
              <ExternalLink />
            </Skeleton>
          }
        >
          {isMobile ? undefined : <Skeleton>Discuss in Discord</Skeleton>}
        </HeaderText>
      </ScrollFlex>
    </Header>
  );
}
