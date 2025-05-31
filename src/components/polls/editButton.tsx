import { Button, Card, Flex } from "@radix-ui/themes";
import { PencilIcon } from "lucide-react";

interface EditButtonProps {
  editModeEnabled: boolean;
  setEditModeEnabled: (enabled: boolean) => void;
}

export default function EditButton({
  editModeEnabled,
  setEditModeEnabled,
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
    <Card>
      <Flex gap="2" align="center">
        Editing Polls
        <Button
          variant="surface"
          size="2"
          aria-label="Discard changes"
          onClick={() => setEditModeEnabled(false)}
        >
          Discard changes
        </Button>
        <Button
          color="green"
          size="2"
          aria-label="Save changes"
          onClick={() => setEditModeEnabled(false)}
        >
          Save changes
        </Button>
      </Flex>
    </Card>
  );
}
