import type { Meta, Tag } from "@jocasta-polls-api";
import { Flex, TextField } from "@radix-ui/themes";
import { Search, X } from "lucide-react";
import styled from "styled-components";
import { TagSelect } from "./tagSelect";

const SearchContainer = styled(Flex)`
  align-items: center;
  height: 3rem;
  width: 100%;
`;

const SearchBar = styled(TextField.Root)`
  border-radius: var(--radius-3);
  flex: 1;
  height: 100%;
`;

const ClearButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0;
`;

export function PollsSearch({
  handleSearch,
  handleTagSelect,
  searchValue = "",
  selectedTag = null,
  meta = null,
  tags = {},
  tagsOrder = [],
  disabled = false,
}: {
  handleSearch: (value: string) => void;
  handleTagSelect: (tag: string) => void;
  searchValue?: string;
  selectedTag?: number | null;
  meta?: Meta | null;
  tags?: Record<number, Tag>;
  tagsOrder?: number[];
  disabled?: boolean;
}) {
  return (
    <SearchContainer gap="2" align="center">
      <SearchBar
        placeholder="Search polls"
        size="3"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={disabled}
      >
        <TextField.Slot>
          <Search size={20} />
        </TextField.Slot>
        {searchValue && !disabled && (
          <TextField.Slot>
            <ClearButton
              type="button"
              onClick={() => {
                handleSearch("");
              }}
            >
              <X size={20} />
            </ClearButton>
          </TextField.Slot>
        )}
        {meta && <TextField.Slot>{meta.total} results</TextField.Slot>}
      </SearchBar>

      <TagSelect
        selectedTag={selectedTag}
        handleTagSelect={handleTagSelect}
        tags={tags}
        tagsOrder={tagsOrder}
        disabled={disabled}
      />
    </SearchContainer>
  );
}
