'use client';

import { Button, For, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';
import { PiSmileySadLight } from 'react-icons/pi';

import { usePosts } from '@/hooks/posts/usePosts';

import { PostCard } from './PostCard';
import { EmptyState } from '../ui/empty-state';

type PostsListProps = {
  params?: {
    authorId?: string;
    communityId?: string;
    onlyFromFollowed?: boolean;
  };

  disabled?: boolean;
};

export const PostsList = ({ params, disabled }: PostsListProps) => {
  // ..................................................
  // Misc Hooks

  const router = useRouter();

  // ..................................................
  // API Hooks

  const { data: posts, isLoading: postsLoading } = usePosts({
    params,
    options: { enabled: !disabled },
  });

  // ..................................................
  // Render

  if (disabled) {
    return null;
  }

  if (postsLoading) {
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
        <Button variant='subtle' onClick={() => router.push('/posts/new')}>
          Create
          <Icon asChild size='sm'>
            <IoMdAdd />
          </Icon>
        </Button>
      </EmptyState>
    );

  return (
    <VStack w='full' gap='4'>
      <For each={posts}>{post => <PostCard key={post.id} post={post} />}</For>
    </VStack>
  );
};
