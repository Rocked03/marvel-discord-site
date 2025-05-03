import config from "@/app/config/config";
import { useAuthContext } from "@/contexts/AuthProvider";
import { getProfilePictureUrlFromHash } from "@/utils";
import {
  Avatar,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const ProfileCardStyle = styled(Card)`
  cursor: pointer;
`;

export default function ProfileContainer() {
  const { user } = useAuthContext();

  return user ? <ProfileCard /> : <ProfileButton />;
}

function ProfileButton() {
  const { loading } = useAuthContext();

  return (
    <Link href={`${config.apiUrlPolls}/auth`}>
      <Button variant="surface" color="gray" loading={loading}>
        Sign in with Discord
      </Button>
    </Link>
  );
}

function ProfileCard() {
  const { user, signOut } = useAuthContext();

  if (!user) return null;

  const avatarUrl = getProfilePictureUrlFromHash(
    BigInt(user.id),
    user.avatar ?? null
  );

  const router = useRouter();

  const handleLogout = async () => {
    await signOut().then(() => {
      router.push("/polls");
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <ProfileCardStyle>
          <Flex gap="2" align="center" justify="center">
            <Avatar
              src={avatarUrl}
              fallback={user.global_name?.charAt(0) || "?"}
            />
            <Flex direction="column" gap="0" align="start">
              <Heading size="3">{user.global_name}</Heading>
              <Text size="1">@{user.username}</Text>
            </Flex>
          </Flex>
        </ProfileCardStyle>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleLogout}>Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
