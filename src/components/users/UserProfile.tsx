'use client';

import {
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { LuUser } from 'react-icons/lu';

import { useAuthContext } from '@/hooks/useAuthContext';
import { useFollowUser } from '@/hooks/users/useFollowUser';
import { useUnfollowUser } from '@/hooks/users/useUnfollowUser';
import { useUser } from '@/hooks/users/useUser';
import { useUserStats } from '@/hooks/users/useUserStats';

import { Divider } from '../Divider';
import { PostsList } from '../posts/PostsList';

type UserProfileProps = {
  userId: string;
};

export const UserProfile = ({ userId }: UserProfileProps) => {
  // ..................................................
  // Contexts

  const { userId: currentUserId } = useAuthContext();

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { data: user, isLoading: userIsLoading } = useUser({
    params: { id: userId },
  });

  const { data: userStats, isLoading: userStatsIsLoading } = useUserStats({
    params: { id: userId },
  });

  const { mutate: followUser, isPending: followUserIsLoading } = useFollowUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', { id: userId }] });
      queryClient.invalidateQueries({
        queryKey: ['users', 'stats', { id: userId }],
      });
    },
  });

  const { mutate: unfollowUser, isPending: unfollowUserIsLoading } =
    useUnfollowUser({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users', { id: userId }] });
        queryClient.invalidateQueries({
          queryKey: ['users', 'stats', { id: userId }],
        });
      },
    });

  // ..................................................
  // Functions

  const toggleSubscription = () => {
    if (!user) return;

    if (!user.isFollowed) {
      followUser(user.id);
      return;
    }

    unfollowUser(user.id);
  };

  // ..................................................
  // Variables

  const loading =
    userIsLoading ||
    userStatsIsLoading ||
    followUserIsLoading ||
    unfollowUserIsLoading;

  // ..................................................
  // Render

  if (userIsLoading) {
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
          Profile are loading...
        </Text>
      </VStack>
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
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt='User Avatar'
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
            <LuUser />
          </Icon>
        )}

        <VStack gap='4'>
          <Text textStyle='4xl' fontWeight='medium' color='colorPalette.900'>
            {user?.name}
          </Text>
          {userStats && (
            <HStack gap='4'>
              <Text color='fg.muted'>Followers {userStats.followersCount}</Text>
              <Text color='fg.muted'>
                Followings {userStats.followingCount}
              </Text>
              <Text color='fg.muted'>
                Communities{' '}
                {userStats.communitiesCount +
                  userStats.followedCommunitiesCount}
              </Text>
            </HStack>
          )}
          {currentUserId && currentUserId !== userId && (
            <HStack w='full'>
              <Button
                w='full'
                size='sm'
                onClick={toggleSubscription}
                variant={!user?.isFollowed ? 'solid' : 'outline'}
                disabled={loading}
                loading={loading}
              >
                {!user?.isFollowed ? 'Follow' : 'Unfollow'}
              </Button>
            </HStack>
          )}
        </VStack>
      </Flex>
      <Divider />
      <PostsList params={{ authorId: user?.id }} disabled={!user} />
    </VStack>
  );
};
