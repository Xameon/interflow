'use client';

import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { useAuthContext } from '@/hooks/useAuthContext';
import { useUser } from '@/hooks/users/useUser';

export function NavActions() {
  const { userId, logout, authLoading } = useAuthContext();

  const { data: user, isFetching: userLoading } = useUser({
    params: { id: userId! },
    options: {
      enabled: !!userId,
    },
  });

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
      <>
        <Text>{user.name}</Text>
        <Button variant='subtle' size='sm' onClick={logout}>
          Logout
        </Button>
      </>
    );
  };

  return (
    <Flex flexDirection='row' alignItems='center' gap='1rem'>
      {renderActions()}
    </Flex>
  );
}
