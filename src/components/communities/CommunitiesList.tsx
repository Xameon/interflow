'use client';

import { For, Text } from '@chakra-ui/react';

import { useCommunities } from '@/hooks/communities/useCommunities';

import { CommunityCard } from './CommunityCard';
import { EmptyState } from '../ui/empty-state';

export const CommunitiesList = () => {
  // ..................................................
  // API Hooks

  const { data: communities, isLoading: communitiesLoading } = useCommunities(
    {},
  );

  // ..................................................
  // Render

  if (communitiesLoading) {
    return <Text>Loading...</Text>;
  }

  if (!communities || communities.length === 0)
    return <EmptyState title='No Communities found :(' />;

  return (
    <For each={communities}>
      {community => <CommunityCard key={community.id} community={community} />}
    </For>
  );
};
