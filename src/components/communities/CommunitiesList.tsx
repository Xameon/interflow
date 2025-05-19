'use client';

import {
  Collapsible,
  Flex,
  For,
  IconButton,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { MdFilterList } from 'react-icons/md';
import { MdFilterListOff } from 'react-icons/md';

import { useCommunities } from '@/hooks/communities/useCommunities';

import { CommunityCard } from './CommunityCard';
import { SelectCategories } from './SelectCategories';
import { Checkbox } from '../ui/checkbox';
import { EmptyState } from '../ui/empty-state';
import { InputGroup } from '../ui/input-group';

export const CommunitiesList = () => {
  // ..................................................
  // Local States

  const [filtersOpened, setFiltersOpened] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [onlyAuthorCanPost, setOnlyAuthorCanPost] = useState<boolean | null>(
    null,
  );
  const [allowMembersToPost, setAllowMembersToPost] = useState<boolean | null>(
    null,
  );

  // ..................................................
  // API Hooks

  const { data: communities, isLoading: communitiesLoading } = useCommunities({
    params: {
      search: searchText || null,
      categoryId: categoryIds,
      onlyAuthorCanPost:
        onlyAuthorCanPost === allowMembersToPost ? null : onlyAuthorCanPost,
    },
  });

  // ..................................................
  // Render

  return (
    <Flex w='full' direction='column' gap='4' align='center' mt='6' wrap='wrap'>
      <InputGroup
        flex='1'
        startElement={<LuSearch />}
        endElement={
          <IconButton
            variant='ghost'
            onClick={() => setFiltersOpened(prev => !prev)}
          >
            {!filtersOpened ? <MdFilterList /> : <MdFilterListOff />}
          </IconButton>
        }
        w='full'
        maxW='2xl'
      >
        <Input
          placeholder='Search communities'
          variant='subtle'
          size='xl'
          onChange={e => setSearchText(e.target.value)}
        />
      </InputGroup>
      <Collapsible.Root open={filtersOpened} w='full' maxW='2xl'>
        <Collapsible.Content w='full'>
          <Flex
            direction='column'
            bg='colorPalette.50'
            gap='4'
            rounded='md'
            p='4'
          >
            <Text fontWeight='medium'>Categories</Text>
            <SelectCategories
              value={categoryIds}
              onChange={category => {
                const updatedValue = categoryIds.filter(
                  id => id !== category.id,
                );

                if (!category.included) {
                  updatedValue.push(category.id);
                }

                setCategoryIds(updatedValue);
              }}
            />
            <Checkbox
              checked={!!onlyAuthorCanPost}
              onCheckedChange={({ checked }) => {
                setOnlyAuthorCanPost(!!checked);
              }}
            >
              Only Author can Post
            </Checkbox>
            <Checkbox
              checked={!!allowMembersToPost}
              onCheckedChange={({ checked }) => {
                setAllowMembersToPost(!!checked);
              }}
            >
              Allow members to post
            </Checkbox>
          </Flex>
        </Collapsible.Content>
      </Collapsible.Root>
      {communitiesLoading && (
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
      )}
      {!communities ||
        (communities.length === 0 && (
          <EmptyState title='No Communities found :(' />
        ))}
      <For each={communities}>
        {community => (
          <CommunityCard key={community.id} community={community} />
        )}
      </For>
    </Flex>
  );
};
