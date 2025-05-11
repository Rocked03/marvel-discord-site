import type { DiscordUserProfile, Meta, Tag } from "@jocasta-polls-api";
import { Button, Flex, IconButton, TextField, Tooltip } from "@radix-ui/themes";
import {
  CircleDot,
  CircleCheck,
  CircleCheckBig,
  Search,
  X,
  Hash,
} from "lucide-react";
import styled from "styled-components";
import { TagSelect } from "./tagSelect";
import { useIsMobile } from "@/utils/isMobile";
import { PollSearchType } from "@/utils";

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

const HasVotedButton = styled(IconButton)`
  background-color: var(--color-surface);
  border-radius: var(--radius-3);
  color: var(--gray-a11);
  height: 100%;
  width: 3rem;
`;

const SearchIconButton = styled(Button)`
  @media (hover: hover) {
    background-color: transparent;
  }
`;

interface HasVotedInfoType {
  icon: React.ReactNode;
  tooltip: string;
}

const HasVotedInfo: Record<string, HasVotedInfoType> = {
  undefined: {
    icon: <CircleCheck />,
    tooltip: "All polls",
  },
  false: {
    icon: <CircleDot />,
    tooltip: "Unvoted polls",
  },
  true: {
    icon: <CircleCheckBig />,
    tooltip: "Voted polls",
  },
};

function HasVotedToggle({
  hasVoted,
  setHasVoted,
}: {
  hasVoted: boolean | undefined;
  setHasVoted: (value: boolean | undefined) => void;
}) {
  function cycle() {
    if (hasVoted === undefined) {
      setHasVoted(false);
    } else if (hasVoted === false) {
      setHasVoted(true);
    } else {
      setHasVoted(undefined);
    }
  }

  const { icon, tooltip } = HasVotedInfo[String(hasVoted)];

  return (
    <Tooltip content={tooltip}>
      <HasVotedButton variant="surface" color="gray" onClick={cycle}>
        {icon}
      </HasVotedButton>
    </Tooltip>
  );
}

export function PollsSearch({
  handleSearch,
  handleTagSelect,
  searchValue = "",
  selectedTag = null,
  meta = null,
  disabled = false,
  hasVoted = undefined,
  setHasVoted = () => {},
  searchType = PollSearchType.SEARCH,
  user = undefined,
}: {
  handleSearch: (value: string, searchType?: PollSearchType) => void;
  handleTagSelect: (tag: string) => void;
  searchValue?: string;
  selectedTag?: number | null;
  meta?: Meta | null;
  disabled?: boolean;
  hasVoted?: boolean | undefined;
  setHasVoted?: (value: boolean | undefined) => void;
  searchType?: PollSearchType;
  user?: DiscordUserProfile | null;
}) {
  const isMobile = useIsMobile();

  const isIdSearch = searchType === "id";

  const handleSearchTypeCycle = () => {
    if (isIdSearch) {
      handleSearch(searchValue, PollSearchType.SEARCH);
    } else {
      handleSearch(searchValue, PollSearchType.ID);
    }
  };

  return (
    <SearchContainer gap="2" align="center">
      <SearchBar
        type={isIdSearch ? "number" : "text"}
        placeholder={!isIdSearch ? "Search polls" : "Search by ID"}
        size="3"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={disabled}
      >
        <TextField.Slot>
          <SearchIconButton
            variant="ghost"
            color="gray"
            onClick={handleSearchTypeCycle}
          >
            {!isIdSearch ? <Search size={20} /> : <Hash size={20} />}
          </SearchIconButton>
        </TextField.Slot>
        {(searchValue || isIdSearch) && !disabled && (
          <TextField.Slot>
            <ClearButton
              type="button"
              onClick={() => {
                handleSearch("", PollSearchType.SEARCH);
              }}
            >
              <X size={20} />
            </ClearButton>
          </TextField.Slot>
        )}
        {meta && (
          <TextField.Slot>
            {meta.total}
            {isMobile ? "" : " results"}
          </TextField.Slot>
        )}
      </SearchBar>

      {user && <HasVotedToggle hasVoted={hasVoted} setHasVoted={setHasVoted} />}

      <TagSelect
        selectedTag={selectedTag}
        handleTagSelect={handleTagSelect}
        disabled={disabled}
      />
    </SearchContainer>
  );
}
