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
  DropdownMenu,
  Flex,
  HoverCard,
  Link,
  Select,
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
  Plus,
  Pencil,
} from "lucide-react";
import React, {
  cloneElement,
  type ComponentProps,
  isValidElement,
  type ReactElement,
  useState,
} from "react";
import styled from "styled-components";
import { TitleText } from "../titleText";
import { useIsMobile } from "@/utils/isMobile";
import { useTagContext } from "@/contexts/TagContext";

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

const SelectTriggerPill = styled(Select.Trigger).attrs({
  className: "rt-r-lt-both",
})<{ $tag?: Tag }>`
  border-radius: 100rem;
  font-weight: 500;
  padding-block: 0.3rem;
  padding-inline: 0.5rem;

  ${({ $tag }) => {
    const { backgroundColor, textColor } = getTagColors($tag);
    return `
      background-color: ${backgroundColor ?? "var(--gray-6)"};
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

const InfoTagEditDialogTrigger = styled(Dialog.Trigger)`
  --button-ghost-padding-x: 0.1rem;
  --button-ghost-padding-y: 0rem;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-a3);
  }

  &:where([data-state="open"]) {
    background-color: transparent;
  }

  > div {
    padding-inline: 0.2rem;
  }
`;

const InfoTagAddDropdownTrigger = styled(DropdownMenu.Trigger)`
  --button-ghost-padding-x: 0.1rem;
  --button-ghost-padding-y: 0rem;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-a3);
  }

  &:where([data-state="open"]) {
    background-color: transparent;
  }

  > div {
    padding-right: 0.2rem;
  }
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
      editable: true,
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
    editable: true,
  }));
}

interface InfoTag {
  text: string;
  icon: React.ReactNode;
  tooltip?: string;
  mobileOnly?: boolean;
  editable?: boolean;
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

  const [dialogOpen, setDialogOpen] = useState(false);

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
    <>
      <Button variant="ghost" onClick={() => setDialogOpen(true)}>
        <HeaderText icon={<Info />} />
      </Button>
      <InfoTagDialog
        tags={tags}
        open={dialogOpen}
        mobile={isMobile}
        editable={false}
      />
    </>
  );
}

function InfoTagsEditable({
  poll,
  tag,
  totalVotes,
}: {
  poll: Poll;
  tag?: Tag;
  totalVotes?: number;
}) {
  const isMobile = useIsMobile();
  const time = poll.time ? new Date(poll.time) : undefined;

  const [dialogOpen, setDialogOpen] = useState(false);

  const tags: InfoTag[] = [
    ...(tag
      ? [
          {
            text: tag.name,
            icon: <LucideTag />,
            tooltip: poll.num ? `#${poll.num}` : undefined,
            mobileOnly: true,
            editable: false,
          },
        ]
      : []),
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
      editable: false,
    },
    ...(totalVotes
      ? [
          {
            text: `${totalVotes} ${totalVotes === 1 ? "Vote" : "Votes"}`,
            icon: <Vote />,
            editable: false,
          },
        ]
      : []),
    ...PollAuthorshipData({ poll }),
    ...PollArtistData({ poll }),
    {
      text: poll.id.toString(),
      icon: <Hash />,
      mobileOnly: true,
      editable: false,
    },
  ];

  const hasExistingEditableTags = tags.some((tag) => tag.editable);

  return (
    <>
      <Flex gap="3" align="center" justify="between">
        {!isMobile &&
          tags.map((tag) => {
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
        <InfoTagDialog
          tags={tags}
          mobile={isMobile}
          editable={true}
          trigger={
            <InfoTagEditDialogTrigger>
              <Button variant="ghost">
                {hasExistingEditableTags ? (
                  <HeaderText icon={<Pencil />}>Edit info</HeaderText>
                ) : (
                  <HeaderText icon={<Plus />}>Add info</HeaderText>
                )}
              </Button>
            </InfoTagEditDialogTrigger>
          }
        />
      </Flex>
    </>
  );
}

function InfoTagDialog({
  tags,
  open,
  mobile = false,
  editable = false,
  trigger,
}: {
  tags: InfoTag[];
  open?: boolean;
  mobile?: boolean;
  editable?: boolean;
  trigger?: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open}>
      {trigger}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Poll Info</Dialog.Title>

        <Flex gap="4" direction="column" align="start" justify="start">
          {tags.map((tag) => {
            if (tag.mobileOnly && !mobile) return null;
            if (editable && !tag.editable) return null;

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

function InfoTagAddDropdown() {
  const [openArtist, setOpenArtist] = React.useState(false);
  const [openAuthor, setOpenAuthor] = React.useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <InfoTagAddDropdownTrigger>
          <Button variant="ghost">
            <HeaderText icon={<Plus />}>Add info</HeaderText>
          </Button>
        </InfoTagAddDropdownTrigger>
        <DropdownMenu.Content size="1" align="start" variant="soft">
          <DropdownMenu.Item onClick={() => setOpenArtist(true)}>
            <Palette size="18" />
            Artist
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setOpenAuthor(true)}>
            <PencilLine size="18" />
            Poll Author
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
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

export function PollCardHeaderEditable({
  poll,
  tag,
  setTag: setCurrentTag,
  guild,
  votes,
}: {
  poll: Poll;
  tag?: Tag;
  setTag: (tag: Tag) => void;
  guild: PollInfo;
  votes?: Poll["votes"];
}) {
  const isMobile = useIsMobile();
  const { tags, tagsOrder } = useTagContext();

  const totalVotes = votes?.reduce((acc, vote) => acc + vote, 0);

  const pollLink =
    poll.message_id && poll.published && tag
      ? `https://discord.com/channels/${guild.guild_id}/${
          poll.fallback ? guild.fallback_channel_id : tag.channel_id
        }/${poll.message_id}`
      : "";

  return (
    <Header align="center" justify="start" gap="3">
      {!poll.published || !tag ? (
        <Select.Root
          size="1"
          defaultValue={tag ? tag.name : "Select tag"}
          onValueChange={(value) => {
            setCurrentTag(tags[Number(value)]);
          }}
        >
          <SelectTriggerPill $tag={tag}>
            {tag ? tag.name : "Select tag"}
            {poll.num && ` • #${poll.num}`}
          </SelectTriggerPill>
          <Select.Content>
            {tagsOrder.map((tagId) => {
              const tag = tags[tagId];
              if (!tag) return null;
              return (
                <Select.Item key={tag.tag} value={tag.tag.toString()}>
                  {tag.name}
                </Select.Item>
              );
            })}
          </Select.Content>
        </Select.Root>
      ) : (
        <TagPill $tag={tag}>
          {tag.name}
          {poll.num && ` • #${poll.num}`}
        </TagPill>
      )}

      <ScrollFlex gap="3" align="center" justify="between">
        <InfoTagsEditable poll={poll} tag={tag} totalVotes={totalVotes} />

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
