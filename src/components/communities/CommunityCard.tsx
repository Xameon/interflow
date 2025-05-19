'use client';

import {
  Badge,
  Button,
  Card,
  Center,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FiUserPlus, FiExternalLink, FiUserMinus } from 'react-icons/fi';
import { MdLockOutline, MdLockOpen } from 'react-icons/md';

import { useFollowCommunity } from '@/hooks/communities/useFollowCommunity';
import { useUnfollowCommunity } from '@/hooks/communities/useUnfollowCommunity';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Community } from '@/models/communities.model';

import { CommunityLabel } from '../CommunityLabel';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { UserLabel } from '../UserLabel';

type CommunityCardProps = {
  community: Community;
};

export const CommunityCard = ({ community }: CommunityCardProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const invalidateCommunities = () => {
    queryClient.invalidateQueries({ queryKey: ['communities'] });
  };

  const { mutate: followCommunity, isPending: followIsLoading } =
    useFollowCommunity({ onSuccess: invalidateCommunities });
  const { mutate: unfollowCommunity, isPending: unfollowIsLoading } =
    useUnfollowCommunity({ onSuccess: invalidateCommunities });

  // ..................................................
  // Misc Hooks

  const router = useRouter();

  // ..................................................
  // Functions

  const handleToggleSubscription = () => {
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

  return (
    <Card.Root overflow='hidden' mx='auto' w='full' maxW='xl' size='lg'>
      <Card.Body display='flex' flexDirection='column' gap='4' w='full'>
        <Card.Title mb='2'>
          <HStack justify='space-between'>
            <CommunityLabel
              communityId={community.id}
              communityTitle={community.title}
              communityAvatarUrl={community.avatarUrl}
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
        </Card.Title>
        <Card.Description>{community.description}</Card.Description>
        <Flex wrap='wrap' gap='2'>
          {community.categories.map(c => (
            <Badge key={c.id}>{c.name}</Badge>
          ))}
        </Flex>
        <HStack justify='space-between' gap='2' wrap='wrap' w='full'>
          <UserLabel
            userId={community.author.id}
            username={community.author.username}
            avatarUrl={community.author.avatarUrl}
          />

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
      </Card.Body>
      <Card.Footer>
        <HStack justify='space-between' w='full'>
          <HStack gap='2'>
            {userId !== community.author.id && (
              <Button
                variant='subtle'
                loading={subscriptionLoading}
                disabled={subscriptionLoading}
                onClick={handleToggleSubscription}
                colorPalette={!community.isSubscribed ? 'current' : 'red'}
                w='24'
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
            <Button
              w='24'
              variant='outline'
              onClick={() => router.push(`/communities/${community.id}`)}
            >
              View <FiExternalLink />
            </Button>
          </HStack>
          {userId === community.author.id && (
            <HStack>
              <EditButton />
              <DeleteButton />
            </HStack>
          )}
        </HStack>
      </Card.Footer>
    </Card.Root>
  );
};
