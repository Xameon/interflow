'use client';

import { Button, For, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import { PiSmileySadLight } from 'react-icons/pi';

import { usePosts } from '@/hooks/posts/usePosts';

import { PostCard } from './PostCard';
import { EmptyState } from '../ui/empty-state';

export const PostsList = () => {
  // ..................................................
  // API Hooks

  // ..................................................
  // Misc Hooks

  const router = useRouter();

  const { data: posts, isLoading: postsLoading } = usePosts({});

  // ..................................................
  // Render

  if (postsLoading) {
    return (
      <VStack
        h='full'
        bg='gray.50'
        w='fit-content'
        mx='auto'
        mt='32'
        p='8'
        rounded='lg'
        boxShadow='xs'
      >
        <Spinner size='xl' borderWidth='4px' color='colorPalette.700' />
        <Text textStyle='xl' fontWeight='medium' color='colorPalette.700'>
          Posts are loading...
        </Text>
      </VStack>
    );
  }

  if (!posts) {
    return (
      <EmptyState
        icon={<MdErrorOutline />}
        title='Oops, something went wrong'
        description="Sorry, we can't display the posts right now. Please try again later."
        size='lg'
      />
    );
  }

  if (posts.length === 0)
    return (
      <EmptyState
        icon={<PiSmileySadLight />}
        title='There are no posts yet'
        description='However, you can create the first post by clicking the button below.'
        size='lg'
      >
        <Button variant='subtle' onClick={() => router.push('posts/new')}>
          Create{' '}
          <Icon asChild size='sm'>
            <IoMdAdd />
          </Icon>
        </Button>
      </EmptyState>
    );

  return (
    <For each={posts}>{post => <PostCard key={post.id} post={post} />}</For>
  );
};
