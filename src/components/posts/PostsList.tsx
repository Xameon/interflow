'use client';

import { For, Progress } from '@chakra-ui/react';

import { usePosts } from '@/hooks/posts/usePosts';

import { PostCard } from './PostCard';
import { EmptyState } from '../ui/empty-state';

export const PostsList = () => {
  const { data: posts, isFetching: postsLoading } = usePosts({});

  if (postsLoading) {
    return (
      <Progress.Root value={null}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    );
  }

  if (!posts || posts.length === 0)
    return <EmptyState title='No Posts found :(' />;

  return (
    <For each={posts}>{post => <PostCard key={post.id} post={post} />}</For>
  );
};
