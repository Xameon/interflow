'use client';

import { Button, Flex } from '@chakra-ui/react';

import { useDeletePost } from '@/hooks/posts/useDeletePost';
import { Post } from '@/models/posts.model';

import { EditPostModal } from './EditPostModal';

type PostActionsProps = {
  post: Post;
};

export const PostActions = ({ post }: PostActionsProps) => {
  const { mutate: deletePost, isPending: deletePostLoading } = useDeletePost();

  return (
    <Flex justify='start' gap='1rem'>
      <Button
        disabled={deletePostLoading}
        loading={deletePostLoading}
        onClick={() => deletePost(post.id)}
      >
        Delete
      </Button>
      <EditPostModal post={post} />
    </Flex>
  );
};
