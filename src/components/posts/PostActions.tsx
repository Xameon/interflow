'use client';

import { Button } from '@chakra-ui/react';

import { useDeletePost } from '@/hooks/posts/useDeletePost';

type PostActionsProps = {
  id: string;
};

export const PostActions = ({ id }: PostActionsProps) => {
  const { mutate: deletePost, isPending: deletePostLoading } = useDeletePost();

  return (
    <Button
      disabled={deletePostLoading}
      loading={deletePostLoading}
      onClick={() => deletePost(id)}
    >
      Delete
    </Button>
  );
};
