'use client';

import {
  Button,
  Flex,
  HStack,
  Menu,
  Portal,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar } from '@/components/ui/avatar';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useUser } from '@/hooks/users/useUser';

export const NavActions = () => {
  // ..................................................
  // Contexts

  const { userId, authLoading } = useAuthContext();

  // ..................................................
  // API Hooks

  const { data: user, isFetching: userLoading } = useUser({
    params: { id: userId! },
    options: {
      enabled: !!userId,
    },
  });

  const { mutateAsync: logoutAsync, isPending: logoutLoading } = useLogout();

  // ..................................................
  // Misc Hooks

  const router = useRouter();

  // ..................................................
  // Functions

  const handleLogout = async () => {
    await logoutAsync();

    location.reload();
  };

  const renderActions = () => {
    if (authLoading || userLoading) {
      return <Spinner />;
    }

    if (!user) {
      return (
        <>
          <Button asChild size='sm'>
            <Link href='/sign-in'>Sign In</Link>
          </Button>
          <Button asChild size='sm' variant='outline'>
            <Link href='/sign-up'>Sign Up</Link>
          </Button>
        </>
      );
    }

    return (
      <Menu.Root>
        <Menu.Trigger asChild>
          <HStack cursor='pointer'>
            <Avatar
              src={user.avatarUrl ?? undefined}
              variant='subtle'
              colorPalette='gray'
              size='sm'
            />
            <Text fontWeight='medium'>{user.name}</Text>
          </HStack>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value='following'
                onClick={() => router.push(`/following`)}
              >
                Following
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item
                value='profile'
                onClick={() => router.push(`/users/${user.id}`)}
              >
                Profile
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item
                value='new-post'
                onClick={() => router.push('/posts/new')}
              >
                Create Post
              </Menu.Item>
              <Menu.Item
                value='new-community'
                onClick={() => router.push('/communities/new')}
              >
                Create Community
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item value='logout' asChild>
                <Button
                  variant='subtle'
                  size='sm'
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  loading={logoutLoading}
                >
                  Logout
                </Button>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    );
  };

  // ..................................................
  // Render

  return (
    <Flex flexDirection='row' alignItems='center' gap='1rem'>
      {renderActions()}
    </Flex>
  );
};
