'use client';

import { Flex, For, Spinner, Text, VStack } from '@chakra-ui/react';

import { useCommunities } from '@/hooks/communities/useCommunities';

import { CommunityCard } from './CommunityCard';
import { EmptyState } from '../ui/empty-state';

export const CommunitiesList = () => {
  // ..................................................
  // API Hooks

  const { data: communities, isLoading: communitiesLoading } = useCommunities({
    params: {},
  });

  // ..................................................
  // Render

  if (communitiesLoading) {
    return (
      <VStack
        bg='gray.50'
        w='fit-content'
        mx='auto'
        mt='40'
        p='16'
        rounded='lg'
        boxShadow='xs'
      >
        <Spinner size='xl' color='colorPalette.700' />
        <Text textStyle='xl' color='colorPalette.700'>
          Communities are loading...
        </Text>
      </VStack>
    );
  }

  if (!communities || communities.length === 0)
    return <EmptyState title='No Communities found :(' />;

  return (
    <Flex w='full' direction='column' gap='4' mt='8' wrap='wrap'>
      <For each={communities}>
        {community => (
          <CommunityCard key={community.id} community={community} />
        )}
      </For>
    </Flex>
  );
};
