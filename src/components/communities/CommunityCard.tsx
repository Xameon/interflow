'use client';

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';

import { useAuthContext } from '@/hooks/useAuthContext';
import { Community } from '@/models/communities.model';

type CommunityCardProps = {
  community: Community;
};

export const CommunityCard = ({ community }: CommunityCardProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Render

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '1rem',
        rounded: 'lg',
        shadow: 'sm',
        justifyContent: 'start',
      }}
    >
      <Heading>{community.title}</Heading>
      <Center>
        {community.avatarUrl && (
          <Image
            src={community.avatarUrl}
            alt='Post Image'
            width='md'
            height='md'
          />
        )}
      </Center>
      <Text>{community.description}</Text>
      <Text>Created: {new Date(community.createdAt).toLocaleString()}</Text>
      {community.createdAt !== community.updatedAt && (
        <Text>Updated: {new Date(community.updatedAt).toLocaleString()}</Text>
      )}
      <Text>Author: {community.author.username}</Text>
      <Flex justify='start' gap='1rem'>
        {userId === community.author.id && (
          <>
            <Button colorPalette='red'>Delete</Button>
          </>
        )}
      </Flex>
    </Box>
  );
};
