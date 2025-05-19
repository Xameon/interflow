'use client';

import {
  Badge,
  Center,
  createListCollection,
  HStack,
  Icon,
  Select,
  Spinner,
  Text,
  useSelectContext,
} from '@chakra-ui/react';
import { MdLockOutline } from 'react-icons/md';

import { useCommunities } from '@/hooks/communities/useCommunities';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Community } from '@/models/communities.model';

import { CommunityLabel } from '../CommunityLabel';

const SelectValue = () => {
  const select = useSelectContext();

  const selectedItem = select.selectedItems[0] as Community | null;

  return (
    <Select.ValueText>
      {selectedItem ? (
        <CommunityLabel
          communityId={selectedItem.id}
          communityTitle={selectedItem.title}
          communityAvatarUrl={selectedItem.avatarUrl}
          disableLink
        />
      ) : (
        <Text>None</Text>
      )}
    </Select.ValueText>
  );
};

type SelectUserCommunitiesProps = {
  onChange: (communityId: string | null) => void;
};

export const SelectUserCommunities = ({
  onChange,
}: SelectUserCommunitiesProps) => {
  // ..................................................
  // Contexts

  const { userId, authLoading } = useAuthContext();

  // ..................................................
  // API Hooks

  const { data: userCommunities, isLoading: userCommunitiesIsLoading } =
    useCommunities({
      params: { followerId: userId! },
      options: { enabled: !!userId },
    });

  // ..................................................
  // Render

  if (!userId) {
    return <Text>Not Authorized</Text>;
  }

  if (!userCommunities) {
    return <Text>Error loading communities</Text>;
  }

  if (userCommunities.length < 1) {
    return <Text>{`You don't have any communities to post to yet.`}</Text>;
  }

  const communities = createListCollection<Community>({
    items: userCommunities,
    isItemDisabled: item => item.onlyAuthorCanPost && item.author.id !== userId,
    itemToString: item => item.title,
    itemToValue: item => item.id,
  });

  return (
    <Select.Root
      collection={communities}
      size='lg'
      positioning={{ sameWidth: true }}
      onValueChange={({ value }) => {
        onChange(value.at(0) ?? null);
      }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <SelectValue />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.ClearTrigger />
          <Select.Indicator />
          {userCommunitiesIsLoading ||
            (authLoading && (
              <Spinner size='xs' borderWidth='1.5px' color='fg.muted' />
            ))}
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {communities.items.map(item => (
            <Select.Item item={item} key={item.id} justifyContent='flex-start'>
              <HStack justify='space-between' w='full'>
                <CommunityLabel
                  communityId={item.id}
                  communityTitle={item.title}
                  communityAvatarUrl={item.avatarUrl}
                  disableLink
                />
                {item.onlyAuthorCanPost && item.author.id !== userId && (
                  <Badge size='md' colorPalette='yellow'>
                    <Center gap='1'>
                      <Text>Only Owner can Post</Text>
                      <Icon as={MdLockOutline} size='md' />
                    </Center>
                  </Badge>
                )}
              </HStack>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
