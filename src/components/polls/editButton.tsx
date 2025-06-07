import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";
import styled from "styled-components";

const CardStyle = styled(Card)`
  z-index: 1000;
`;

const ButtonStyle = styled(Button)`
  transition: background-color 0.2s ease-in-out;
  transition: color 0.2s ease-in-out;
`;

interface EditButtonProps {
  editModeEnabled: boolean;
  setEditModeEnabled: (enabled: boolean) => void;
  hasChanges?: boolean;
  text?: string;
}

export default function EditButton({
  editModeEnabled,
  setEditModeEnabled,
  hasChanges = false,
  text,
}: EditButtonProps) {
  if (!editModeEnabled) {
    return (
      <Button
        variant="surface"
        size="2"
        aria-label="Edit Poll"
        onClick={() => setEditModeEnabled(true)}
      >
        <PencilIcon size={20} />
        Edit mode
      </Button>
    );
  }

  return (
    <CardStyle>
      <Flex gap="2" align="center">
        {text && <Text>{text}</Text>}
        <ButtonStyle
          variant="surface"
          size="2"
          aria-label="Discard changes"
          onClick={() => setEditModeEnabled(false)}
        >
          Discard changes
        </ButtonStyle>
        <ButtonStyle
          variant={hasChanges ? "solid" : "surface"}
          color="green"
          size="2"
          aria-label="Save changes"
          disabled={!hasChanges}
          onClick={() => setEditModeEnabled(false)}
        >
          Save changes
        </ButtonStyle>
      </Flex>
    </CardStyle>
  );
}
