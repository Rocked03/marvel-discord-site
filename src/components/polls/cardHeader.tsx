import {
  filterDescriptionWithRegex,
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
  TextField,
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
  X,
} from "lucide-react";
import {
  cloneElement,
  type ComponentProps,
  type Dispatch,
  isValidElement,
  type ReactElement,
  useState,
} from "react";
import styled from "styled-components";
import { TitleText } from "../titleText";
import { useIsMobile } from "@/utils/isMobile";
import { useTagContext } from "@/contexts/TagContext";
import DatePickerComponent from "./datePicker";

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
      color: ${textColor ?? "inherit"};
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
  overflow: visible;
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

  > div {
    padding-inline: 0.2rem;
  }
`;

const InfoTagAddDropdownTrigger = styled(DropdownMenu.Trigger)`
  cursor: pointer;

  &:hover {
    background-color: var(--gray-a3);
  }

  &:where([data-state="open"]) {
    background-color: transparent;
  }
`;

const InfoTagTextField = styled(TextField.Root).attrs({
  size: "1",
})`
  border: none;
  height: auto;
  font-size: var(--font-size-2);
`;

const InfoTagTextFieldTooltip = styled(InfoTagTextField)`
  font-size: var(--font-size-1);

  > input,
  div {
    font-variation-settings: "slnt" -10;
  }
`;

const InfoTagDeleteButton = styled(Button).attrs({
  variant: "ghost",
})`
  padding: var(--button-ghost-padding-y);
  margin-left: 0;
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

function PollAuthorshipData(description: string | null): InfoTag[] {
  if (!description) return [];

  let descriptor = "";
  let author = "";
  let authorId = "";

  pollDescriptionAuthorshipRegex.lastIndex = 0;
  const match = description?.match(pollDescriptionAuthorshipRegex);

  if (match) {
    descriptor = match[1].trim();
    author = `@${match[2].trim()}`;
    authorId = match[3].trim();
  } else {
    const match = description?.match(pollDescriptionAnonymousAuthorshipRegex);
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
      additionalContent: {
        authorId: authorId,
      },
      type: InfoTagType.AUTHOR,
      tooltip: `${descriptor} by`,
      editable: true,
      id: "author",
    },
  ];
}

function PollArtistData(description: string | null): InfoTag[] {
  if (!description) return [];

  pollDescriptionArtRegex.lastIndex = 0;
  const matches = [...description.matchAll(pollDescriptionArtRegex)];

  return matches.map((match, index) => ({
    text: match[2].trim(),
    type: InfoTagType.ARTIST,
    tooltip: `${match[1].trim()} by`,
    editable: true,
    id: `artist-${index}`,
  }));
}

interface InfoTag {
  text: string;
  additionalContent?: Record<string, string>;
  type: InfoTagType;
  node?: React.ReactNode;
  tooltip?: string;
  mobileOnly?: boolean;
  editable?: boolean;
  id: string;
}

enum InfoTagType {
  ARTIST = "artist",
  AUTHOR = "author",
  DATE = "date",
  ID = "id",
  TAG = "tag",
  VOTES = "votes",
}

const InfoTagIconMap: Record<InfoTagType, React.ReactNode> = {
  [InfoTagType.ARTIST]: <Palette />,
  [InfoTagType.AUTHOR]: <PencilLine />,
  [InfoTagType.DATE]: <Calendar />,
  [InfoTagType.ID]: <Hash />,
  [InfoTagType.TAG]: <LucideTag />,
  [InfoTagType.VOTES]: <Vote />,
};

const InfoTagTypeOrder: InfoTagType[] = [
  InfoTagType.TAG,
  InfoTagType.DATE,
  InfoTagType.VOTES,
  InfoTagType.ARTIST,
  InfoTagType.AUTHOR,
  InfoTagType.ID,
];

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
      type: InfoTagType.TAG,
      tooltip: poll.num ? `#${poll.num}` : undefined,
      mobileOnly: true,
      id: "tag",
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
      type: InfoTagType.DATE,
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
      id: "date",
    },
    {
      text: `${totalVotes} ${totalVotes === 1 ? "Vote" : "Votes"}`,
      type: InfoTagType.VOTES,
      id: "votes",
    },
    ...PollAuthorshipData(poll.description),
    ...PollArtistData(poll.description),
    {
      text: poll.id.toString(),
      type: InfoTagType.ID,
      mobileOnly: true,
      id: "pollId",
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
                <HeaderText icon={InfoTagIconMap[tag.type]}>
                  {tag.text}
                </HeaderText>
              </Tooltip>
            ) : (
              <HeaderText key={tag.text} icon={InfoTagIconMap[tag.type]}>
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
  description,
  setDescription,
}: {
  poll: Poll;
  tag?: Tag;
  totalVotes?: number;
  description: string | null;
  setDescription: (description: string) => void;
}) {
  const isMobile = useIsMobile();
  const [dateTime, setDateTime] = useState<Date | null>(
    poll.time ? new Date(poll.time) : null
  );

  const tags: InfoTag[] = [
    ...(tag
      ? [
          {
            text: tag.name,
            type: InfoTagType.TAG,
            tooltip: poll.num ? `#${poll.num}` : undefined,
            mobileOnly: true,
            editable: false,
            id: "tag",
          },
        ]
      : []),
    {
      text: dateTime
        ? dateTime.toLocaleDateString("en-US", {
            day: isMobile ? "2-digit" : "numeric",
            month: isMobile ? "2-digit" : "long",
            year: isMobile ? "2-digit" : "numeric",
          })
        : "No date set.",
      type: InfoTagType.DATE,
      tooltip: dateTime
        ? dateTime.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            minute: "2-digit",
            hour: "2-digit",
            timeZoneName: "short",
          })
        : "No date set.",
      editable: false,
      node: !poll.published ? (
        <DatePickerComponent
          selected={dateTime ?? null}
          onChange={(date) => {
            setDateTime(date);
          }}
        />
      ) : undefined,
      id: "date",
    },
    ...(totalVotes
      ? [
          {
            text: `${totalVotes} ${totalVotes === 1 ? "Vote" : "Votes"}`,
            type: InfoTagType.VOTES,
            editable: false,
            id: "votes",
          },
        ]
      : []),
    ...PollAuthorshipData(description),
    ...PollArtistData(description),
    {
      text: poll.id.toString(),
      type: InfoTagType.ID,
      mobileOnly: true,
      editable: false,
      id: "pollId",
    },
  ];

  const [editableTags, setEditableTags] = useState<InfoTag[]>(tags);

  const hasExistingEditableTags = editableTags.length > 0;

  function onDialogOpenChange(open: boolean) {
    if (open) {
      return;
    }

    const filteredDescription = filterDescriptionWithRegex(description);

    const additionalInfo = [];
    for (const tag of editableTags) {
      if (tag.type === InfoTagType.ARTIST) {
        additionalInfo.push(
          `${tag.tooltip?.replace(/\s*by\s*$/, "").trim()} by ${tag.text}.`
        );
      } else if (tag.type === InfoTagType.AUTHOR) {
        additionalInfo.push(
          `${tag.tooltip?.replace(/\s*by\s*$/, "").trim()} by @${tag.text} (<@${
            tag.additionalContent?.authorId || 0
          }>).`
        );
      }
    }

    const newDescription = filteredDescription
      ? `${filteredDescription} ${additionalInfo.join(" ")}`
      : additionalInfo.join(" ");
    setDescription(newDescription);
  }

  return (
    <>
      <Flex gap="3" align="center" justify="between" overflow="visible">
        {tags.map((tag) => {
          const component =
            tag.mobileOnly !== true &&
            (!isMobile || tag.type === InfoTagType.DATE) &&
            (tag.tooltip ? (
              <Tooltip key={tag.id} content={tag.tooltip}>
                <HeaderText icon={InfoTagIconMap[tag.type]}>
                  {tag.node ?? tag.text}
                </HeaderText>
              </Tooltip>
            ) : (
              <HeaderText key={tag.id} icon={InfoTagIconMap[tag.type]}>
                {tag.node ?? tag.text}
              </HeaderText>
            ));

          return tag.editable ? (
            <InfoTagDialog
              key={tag.id}
              tags={editableTags}
              setTags={setEditableTags}
              mobile={isMobile}
              editable={true}
              trigger={
                <InfoTagEditDialogTrigger>
                  <Button variant="ghost" color="gray">
                    {component}
                  </Button>
                </InfoTagEditDialogTrigger>
              }
            />
          ) : (
            component
          );
        })}
        <InfoTagDialog
          tags={editableTags}
          setTags={setEditableTags}
          mobile={isMobile}
          editable={true}
          trigger={
            <InfoTagEditDialogTrigger>
              <Button variant="ghost" color="gray">
                {hasExistingEditableTags ? (
                  <HeaderText icon={<Pencil />}>Edit info</HeaderText>
                ) : (
                  <HeaderText icon={<Plus />}>Add info</HeaderText>
                )}
              </Button>
            </InfoTagEditDialogTrigger>
          }
          onDialogOpenChange={onDialogOpenChange}
        />
      </Flex>
    </>
  );
}

type RegexGroupRule = {
  regex: RegExp;
  group: number;
  wrapper?: (value: string) => string;
};

function InfoTagDialog({
  tags,
  setTags,
  open,
  mobile = false,
  editable = false,
  trigger,
  onDialogOpenChange,
}: {
  tags: InfoTag[];
  setTags?: Dispatch<React.SetStateAction<InfoTag[]>>;
  open?: boolean;
  mobile?: boolean;
  editable?: boolean;
  trigger?: React.ReactNode;
  onDialogOpenChange?: (open: boolean) => void;
}) {
  const sortedTags = tags.sort((a, b) => {
    const indexA = InfoTagTypeOrder.indexOf(a.type);
    const indexB = InfoTagTypeOrder.indexOf(b.type);
    return indexA - indexB;
  });

  const handleTagEdit = (
    index: number,
    {
      text,
      tooltip,
      additionalContent,
      rules = [],
      allowTrim = false,
      allowEmpty = true,
    }: {
      text?: string;
      tooltip?: string;
      additionalContent?: {
        key: string;
        value: string;
      };
      rules?: RegexGroupRule[];
      allowTrim?: boolean;
      allowEmpty?: boolean;
    }
  ) => {
    let newValue = text || tooltip || additionalContent?.value || "";
    if (allowTrim) {
      newValue = newValue.trim();
    }

    const isValid =
      rules.length > 0 && (!allowEmpty || newValue !== "")
        ? rules.some(({ regex, group, wrapper }) => {
            regex.lastIndex = 0;
            const match = regex.exec(wrapper ? wrapper(newValue) : newValue);
            return match && newValue === match[group];
          })
        : true;

    if (!isValid) {
      return;
    }

    if (setTags) {
      const newTags = [...tags];
      if (text !== undefined) {
        newTags[index].text = text;
      }
      if (tooltip !== undefined) {
        newTags[index].tooltip = tooltip;
      }
      if (additionalContent) {
        newTags[index].additionalContent = {
          ...newTags[index].additionalContent,
          [additionalContent.key]: additionalContent.value,
        };
      }
      setTags(newTags);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onDialogOpenChange}>
      {trigger}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Poll Info</Dialog.Title>

        <Flex gap="4" direction="column" align="start" justify="start">
          {sortedTags.map((tag, index) => {
            if (tag.mobileOnly && !mobile) return null;
            if (!mobile && editable && !tag.editable) return null;

            const icon = InfoTagIconMap[tag.type];
            const styledIcon = isValidElement(icon)
              ? cloneElement(icon as ReactElement<LucideProps>, {
                  size: 26,
                  color: "var(--gray-a11)",
                  strokeWidth: 2,
                })
              : icon;

            let content = (
              <Flex gap="1" align="start" direction="column">
                <Text size="2">{tag.text}</Text>
                {tag.tooltip && (
                  <DialogTooltipText>{tag.tooltip}</DialogTooltipText>
                )}
              </Flex>
            );

            if (tag.editable) {
              if (tag.type === InfoTagType.ARTIST) {
                content = (
                  <Flex gap="1" align="start" direction="column">
                    <InfoTagTextField
                      value={tag.text}
                      onChange={(e) => {
                        handleTagEdit(index, {
                          text: e.target.value,
                          rules: [
                            {
                              regex: pollDescriptionArtRegex,
                              group: 2,
                              wrapper: (value) => `Art by ${value}`,
                            },
                          ],
                        });
                      }}
                      placeholder="Artist name"
                    />
                    <InfoTagTextFieldTooltip
                      value={tag.tooltip?.replace(/\s*by\s*$/, "")}
                      onChange={(e) => {
                        const trimmedValue = e.target.value.replace(
                          /\s*by\s*$/,
                          ""
                        );
                        handleTagEdit(index, {
                          tooltip: trimmedValue,
                          rules: [
                            {
                              regex: pollDescriptionArtRegex,
                              group: 1,
                              wrapper: (value) => `${value} by Artist`,
                            },
                          ],
                          allowTrim: true,
                          allowEmpty: false,
                        });
                      }}
                      placeholder="Art by"
                    >
                      <TextField.Slot side="right">by</TextField.Slot>
                    </InfoTagTextFieldTooltip>
                  </Flex>
                );
              } else if (tag.type === InfoTagType.AUTHOR) {
                content = (
                  <Flex gap="1" align="start" direction="column">
                    <Flex gap="1" align="start" direction="row">
                      <InfoTagTextField
                        value={tag.text.replace(/^@/, "")}
                        onChange={(e) => {
                          handleTagEdit(index, {
                            text: e.target.value,
                            rules: [
                              {
                                regex: pollDescriptionAuthorshipRegex,
                                group: 2,
                                wrapper: (value) =>
                                  `Submitted by @${value} (<@0>)`,
                              },
                            ],
                          });
                        }}
                        placeholder="Anonymous"
                      />
                      <InfoTagTextField
                        value={tag.additionalContent?.authorId}
                        onChange={(e) => {
                          handleTagEdit(index, {
                            additionalContent: {
                              key: "authorId",
                              value: e.target.value,
                            },
                            rules: [
                              {
                                regex: pollDescriptionAuthorshipRegex,
                                group: 3,
                                wrapper: (value) =>
                                  `Submitted by @username (<@${value}>)`,
                              },
                            ],
                          });
                        }}
                        placeholder="User ID"
                      />
                    </Flex>
                    <InfoTagTextFieldTooltip
                      value={tag.tooltip?.replace(/\s*by\s*$/, "")}
                      onChange={(e) => {
                        const trimmedValue = e.target.value.replace(
                          /\s*by\s*$/,
                          ""
                        );
                        handleTagEdit(index, {
                          tooltip: trimmedValue,
                          rules: [
                            {
                              regex: pollDescriptionAuthorshipRegex,
                              group: 1,
                              wrapper: (value) =>
                                `${value} by @username (<@0>)`,
                            },
                          ],
                        });
                      }}
                      placeholder="Submitted"
                    >
                      <TextField.Slot side="right">by</TextField.Slot>
                    </InfoTagTextFieldTooltip>
                  </Flex>
                );
              }
            }

            return (
              <Flex gap="1" align="center" key={tag.id}>
                {styledIcon}
                {content}
                {editable && tag.editable && (
                  <InfoTagDeleteButton
                    onClick={() =>
                      setTags?.(tags.filter((_, i) => i !== index))
                    }
                  >
                    <X />
                  </InfoTagDeleteButton>
                )}
              </Flex>
            );
          })}

          {setTags && <InfoTagAddDropdown tags={tags} setTags={setTags} />}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function InfoTagAddDropdown({
  tags,
  setTags,
}: {
  tags: InfoTag[];
  setTags: Dispatch<React.SetStateAction<InfoTag[]>>;
}) {
  function handleAddTag(tag: InfoTag) {
    setTags([...tags, tag]);
  }

  return (
    <>
      <DropdownMenu.Root>
        <InfoTagAddDropdownTrigger>
          <Button variant="surface" color="gray">
            <HeaderText icon={<Plus />}>Add info</HeaderText>
          </Button>
        </InfoTagAddDropdownTrigger>
        <DropdownMenu.Content size="1" align="start" variant="soft">
          <DropdownMenu.Item
            onClick={() => {
              handleAddTag({
                text: "",
                type: InfoTagType.ARTIST,
                tooltip: "Art",
                editable: true,
                id: `artist-${tags
                  .filter((tag) => tag.id.startsWith("artist"))
                  .length.toString()}`,
              });
            }}
          >
            <Palette size="18" />
            Artist
          </DropdownMenu.Item>
          {!tags.some((tag) => tag.type === InfoTagType.AUTHOR) && (
            <DropdownMenu.Item
              onClick={() => {
                handleAddTag({
                  text: "",
                  type: InfoTagType.AUTHOR,
                  tooltip: "Submitted",
                  editable: true,
                  id: `author-${tags
                    .filter((tag) => tag.id.startsWith("author"))
                    .length.toString()}`,
                });
              }}
            >
              <PencilLine size="18" />
              Poll Author
            </DropdownMenu.Item>
          )}
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
  const [description, setDescription] = useState(poll.description);

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
        <InfoTagsEditable
          poll={poll}
          tag={tag}
          totalVotes={totalVotes}
          description={description}
          setDescription={setDescription}
        />

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
