'use client';

import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { FiUserMinus, FiUserPlus } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { MdErrorOutline, MdLockOpen, MdLockOutline } from 'react-icons/md';

import { useCommunity } from '@/hooks/communities/useCommunity';
import { useFollowCommunity } from '@/hooks/communities/useFollowCommunity';
import { useUnfollowCommunity } from '@/hooks/communities/useUnfollowCommunity';
import { useAuthContext } from '@/hooks/useAuthContext';

import { Divider } from '../Divider';
import { PostsList } from '../posts/PostsList';
import { EmptyState } from '../ui/empty-state';
import { UserLabel } from '../UserLabel';

type CommunityProfileProps = {
  communityId: string;
};

export const CommunityProfile = ({ communityId }: CommunityProfileProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { data: community, isLoading: communityIsLoading } = useCommunity({
    params: { communityId },
  });

  const invalidateCommunities = () => {
    queryClient.invalidateQueries({
      queryKey: ['communities', { communityId }],
    });
  };

  const { mutate: followCommunity, isPending: followIsLoading } =
    useFollowCommunity({ onSuccess: invalidateCommunities });
  const { mutate: unfollowCommunity, isPending: unfollowIsLoading } =
    useUnfollowCommunity({ onSuccess: invalidateCommunities });

  // ..................................................
  // Functions

  const handleToggleSubscription = () => {
    if (!community) return;

    if (!community.isSubscribed) {
      followCommunity(community.id);
      return;
    }

    unfollowCommunity(community.id);
  };

  // ..................................................
  // Variables

  const subscriptionLoading = followIsLoading || unfollowIsLoading;

  // ..................................................
  // Render

  if (communityIsLoading) {
    return (
      <VStack
        bg='gray.50'
        w='fit-content'
        mx='auto'
        mt='40'
        p='16'
        rounded='lg'
        boxShadow='sm'
      >
        <Spinner size='xl' color='colorPalette.700' />
        <Text textStyle='xl' color='colorPalette.700'>
          Community are loading...
        </Text>
      </VStack>
    );
  }

  if (!community) {
    return (
      <EmptyState
        icon={<MdErrorOutline />}
        title='Oops, something went wrong'
        description='Sorry, we failed to load this community. Please try again later.'
        size='lg'
      />
    );
  }

  return (
    <VStack mt='8' gap='4'>
      <Flex
        align='center'
        gap='8'
        mx='auto'
        mdDown={{
          flexDirection: 'column',
        }}
      >
        {community.avatarUrl ? (
          <Image
            src={community.avatarUrl}
            alt='Community Avatar'
            h='48'
            w='48'
            rounded='full'
            objectFit='cover'
          />
        ) : (
          <Icon
            asChild
            bg='gray.200'
            h='48'
            w='48'
            color='gray.600'
            rounded='full'
            p='4'
          >
            <HiOutlineUserGroup />
          </Icon>
        )}

        <VStack gap='4' w='xs'>
          <Text textStyle='4xl' fontWeight='medium' color='colorPalette.900'>
            {community.title}
          </Text>

          {userId && userId !== community.author.id && (
            <Button
              variant='subtle'
              loading={subscriptionLoading}
              disabled={subscriptionLoading}
              onClick={handleToggleSubscription}
              colorPalette={!community.isSubscribed ? 'current' : 'red'}
              w='full'
            >
              {!community.isSubscribed ? (
                <>
                  Join <FiUserPlus />
                </>
              ) : (
                <>
                  Leave <FiUserMinus />
                </>
              )}
            </Button>
          )}
        </VStack>
      </Flex>
      <Text p='4'>{community.description}</Text>
      <Divider />
      <Heading textAlign='start' w='full' ml='16'>
        Categories
      </Heading>
      <Flex wrap='wrap' gap='2'>
        {community.categories.map(c => (
          <Badge key={c.id}>{c.name}</Badge>
        ))}
      </Flex>
      <Divider />
      <HStack justify='space-between' w='full'>
        <HStack gap='4'>
          <UserLabel
            userId={community.author.id}
            username={community.author.username}
            avatarUrl={community.author.avatarUrl}
          />
          <Badge colorPalette='gray'>
            {community.createdAt === community.updatedAt ? (
              <>
                <Badge size='md' color='fg.muted'>
                  created
                </Badge>
                {new Date(community.createdAt).toLocaleDateString()}
              </>
            ) : (
              <>
                <Badge size='md' color='fg.muted'>
                  updated
                </Badge>
                {new Date(community.updatedAt).toLocaleDateString()}
              </>
            )}
          </Badge>
        </HStack>
        {community.onlyAuthorCanPost ? (
          <HStack>
            <Badge size='md' colorPalette='yellow'>
              <Center gap='1'>
                <Text>Only Owner can Post</Text>
                <Icon asChild size='md'>
                  <MdLockOutline />
                </Icon>
              </Center>
            </Badge>
          </HStack>
        ) : (
          <HStack>
            <Badge size='md' colorPalette='green'>
              <Center gap='1'>
                <Text>Members can Post</Text>
                <Icon asChild size='md'>
                  <MdLockOpen />
                </Icon>
              </Center>
            </Badge>
          </HStack>
        )}
      </HStack>
      <Divider />
      <PostsList params={{ communityId: community.id }} disabled={!community} />
    </VStack>
  );
};
