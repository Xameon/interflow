'use client';

import { HStack, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar } from './ui/avatar';

type UserLabelProps = {
  userId: string;
  username: string;
  avatarUrl: string | null;
};

export const UserLabel = ({ userId, username, avatarUrl }: UserLabelProps) => {
  const router = useRouter();

  return (
    <HStack>
      <Avatar
        src={avatarUrl ?? undefined}
        variant='subtle'
        colorPalette='gray'
        size='sm'
        cursor='pointer'
        onClick={() => router.push(`/users/${userId}`)}
      />
      <ChakraLink asChild color='colorPalette.900' fontWeight='medium'>
        <Link href={`/users/${userId}`}>{username}</Link>
      </ChakraLink>
    </HStack>
  );
};
