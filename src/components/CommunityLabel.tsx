'use client';

import {
  HStack,
  Link as ChakraLink,
  Text,
  ConditionalValue,
  Icon,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineUserGroup } from 'react-icons/hi';

import { Avatar } from './ui/avatar';

type CommunityLabelProps = {
  communityId: string;
  communityTitle: string;
  communityAvatarUrl: string | null;
  avatarSize?: ConditionalValue<
    'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'xs' | '2xs' | 'full' | undefined
  >;
  disableLink?: boolean;
};

export const CommunityLabel = ({
  communityId,
  communityTitle,
  communityAvatarUrl,
  avatarSize,
  disableLink,
}: CommunityLabelProps) => {
  const router = useRouter();

  return (
    <HStack>
      <Avatar
        src={communityAvatarUrl ?? undefined}
        fallback={<Icon as={HiOutlineUserGroup} size='lg' color='fg.muted' />}
        variant='subtle'
        colorPalette='gray'
        size={avatarSize ?? 'sm'}
        cursor={!disableLink ? 'pointer' : 'auto'}
        onClick={() => {
          if (!disableLink) router.push(`/communities/${communityId}`);
        }}
      />
      {!disableLink ? (
        <ChakraLink asChild color='colorPalette.900' fontWeight='medium'>
          <Link href={`/communities/${communityId}`}>{communityTitle}</Link>
        </ChakraLink>
      ) : (
        <Text>{communityTitle}</Text>
      )}
    </HStack>
  );
};
