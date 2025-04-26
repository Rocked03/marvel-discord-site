import { getContrastColorFromInt, intToColorHex } from "@/utils";
import type { Tag } from "@jocasta-polls-api";
import { Box, Select } from "@radix-ui/themes";
import styled from "styled-components";

const TagSelectContainer = styled(Box)`
  height: 100%;
`;

const TagSelectRoot = styled(Select.Root)``;

const TagSelectTrigger = styled(Select.Trigger)<{
  backgroundColor?: string;
  textColor?: string;
}>`
  border-radius: var(--radius-3);
  height: 100%;
  ${({ backgroundColor }) =>
    backgroundColor && `background-color: ${backgroundColor};`}
  ${({ textColor }) => textColor && `color: ${textColor};`}
`;

const TagSelectItem = styled(Select.Item)<{
  backgroundColor?: string;
  textColor?: string;
}>`
  &[data-highlighted] {
    ${({ backgroundColor }) => `background-color: ${backgroundColor}`};
    ${({ textColor }) => textColor && `color: ${textColor};`}
  }
`;

function getTagColors(tag?: Tag) {
  if (!tag) {
    return { backgroundColor: undefined, textColor: undefined };
  }

  const tagColor = tag.colour ? tag.colour : null;
  const backgroundColor = tagColor ? intToColorHex(tagColor) : "var(--red-9)";
  const textColor = tagColor ? getContrastColorFromInt(tagColor) : undefined;
  return { backgroundColor, textColor };
}

export function TagSelect({
  selectedTag,
  handleTagSelect,
  tags,
  tagsOrder,
}: {
  selectedTag: number | null;
  handleTagSelect: (tag: string) => void;
  tags: Record<number, Tag>;
  tagsOrder: number[];
}) {
  const {
    backgroundColor: selectedTagBackgroundColor,
    textColor: selectedTagTextColor,
  } = getTagColors(selectedTag ? tags[selectedTag] : undefined);

  return (
    <TagSelectContainer>
      <TagSelectRoot defaultValue="all" onValueChange={handleTagSelect}>
        <TagSelectTrigger
          aria-label="Filter by tag"
          backgroundColor={selectedTagBackgroundColor}
          textColor={selectedTagTextColor}
        >
          {selectedTag ? tags[selectedTag].name : "All tags"}
        </TagSelectTrigger>
        <Select.Content>
          <Select.Item value="all">All tags</Select.Item>
          <Select.Separator />
          {tagsOrder.map((tag) => {
            const { backgroundColor, textColor } = getTagColors(tags[tag]);
            return (
              <TagSelectItem
                key={tag}
                value={tag.toString()}
                backgroundColor={backgroundColor}
                textColor={textColor}
              >
                {tags[Number(tag)].name}
              </TagSelectItem>
            );
          })}
        </Select.Content>
      </TagSelectRoot>
    </TagSelectContainer>
  );
}
