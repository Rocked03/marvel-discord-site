import config from "@/app/config/config";
import { useAuthContext } from "@/contexts/AuthProvider";
import { getProfilePictureUrlFromHash } from "@/utils";
import { useIsMobile } from "@/utils/isMobile";
import {
  Avatar,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { LogIn } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const ProfileCardStyle = styled(Card)`
  cursor: pointer;
`;

export default function ProfileContainer() {
  const { user } = useAuthContext();
  const router = useRouter();

  return user ? <ProfileCard router={router} /> : <ProfileButton />;
}

function ProfileButton() {
  const { loading } = useAuthContext();
  const isMobile = useIsMobile();

  return (
    <Link href={`${config.apiUrlPolls}/auth`}>
      <Button variant="surface" color="gray" loading={loading}>
        <LogIn />
        {!isMobile && "Sign in with Discord"}
      </Button>
    </Link>
  );
}

function ProfileCard({ router }: { router: AppRouterInstance }) {
  const { user, signOut } = useAuthContext();

  const isMobile = useIsMobile();

  if (!user) return null;

  const avatarUrl = getProfilePictureUrlFromHash(
    BigInt(user.id),
    user.avatar ?? null
  );

  const handleLogout = async () => {
    await signOut().then(() => {
      router.push("/polls");
    });
  };

  const isInServer: boolean = true; // TODO: Check if user is in server

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {!isMobile ? (
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
        ) : (
          <Avatar
            src={avatarUrl}
            fallback={user.global_name?.charAt(0) || "?"}
            style={{
              width: "3rem",
              height: "3rem",
            }}
          />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Signed in as @{user.username}</DropdownMenu.Label>
        <DropdownMenu.Separator />

        <DropdownMenu.Item disabled>
          My contributions (coming soon)
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link href="https://forms.gle/G2BPKdTdGEMN1yhk7" target="_blank">
            Suggest a question
          </Link>
        </DropdownMenu.Item>

        {isInServer && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <Link href="https://discord.gg/marvel" target="_blank">
                Join the Marvel Discord
              </Link>
            </DropdownMenu.Item>
          </>
        )}

        <DropdownMenu.Separator />
        {/* <Tooltip
          content="Refreshes your server memberships"
          side="left"
          delayDuration={10}
        >
          <DropdownMenu.Item onClick={fetchUser}>
            Refresh user
          </DropdownMenu.Item>
        </Tooltip> */}
        <DropdownMenu.Item onClick={handleLogout}>Sign out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
