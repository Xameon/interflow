'use client';

import {
  Flex,
  HStack,
  Input,
  InputGroup,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import { useUsers } from '@/hooks/users/useUsers';

import { EmptyState } from '../ui/empty-state';
import { UserLabel } from '../UserLabel';

export const SearchUsers = () => {
  const [searchKey, setSearchKey] = useState<string>('');

  const { data: users, isLoading: usersIsLoading } = useUsers({
    params: { name: searchKey },
    options: { enabled: searchKey.length >= 3 },
  });

  return (
    <Flex direction='column' gap='8'>
      <InputGroup flex='1' startElement={<LuSearch />} w='full' maxW='2xl'>
        <Input
          placeholder='Search communities'
          variant='subtle'
          size='xl'
          onChange={e => setSearchKey(e.target.value)}
        />
      </InputGroup>
      {usersIsLoading && (
        <VStack bg='gray.50' w='fit-content' mx='auto' p='16' rounded='lg'>
          <Spinner size='xl' color='colorPalette.700' />
          <Text textStyle='xl' color='colorPalette.700'>
            Searching...
          </Text>
        </VStack>
      )}
      {!users?.length && <EmptyState title='No Users found' />}
      <Flex direction='column' gap='4'>
        {users?.map(({ id, name, avatarUrl }) => (
          <HStack
            key={id}
            justify='space-between'
            w='full'
            p='4'
            boxShadow='sm'
            rounded='md'
          >
            <UserLabel userId={id} username={name} avatarUrl={avatarUrl} />
          </HStack>
        ))}
      </Flex>
    </Flex>
  );
};
