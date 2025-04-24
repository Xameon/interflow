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
import { useQueryClient } from '@tanstack/react-query';

import { useDeletePost } from '@/hooks/posts/useDeletePost';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Post } from '@/models/posts.model';

import { EditPostModal } from './EditPostModal';

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutate: deletePostAsync, isPending: deletePostLoading } =
    useDeletePost({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });

  // ..................................................
  // Functions

  const handleDeletePost = async () => {
    await deletePostAsync(post.id);
  };

  // ..................................................
  // Render

  return (
    <Box
      key={post.id}
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
      <Heading>{post.title}</Heading>
      <Center>
        {post.imageUrls?.[0] && (
          <Image
            src={post.imageUrls[0]}
            alt='Post Image'
            width='md'
            height='md'
          />
        )}
      </Center>
      <Text>{post.description}</Text>
      <Text>Created: {new Date(post.createdAt).toLocaleString()}</Text>
      {post.createdAt !== post.updatedAt && (
        <Text>Updated: {new Date(post.updatedAt).toLocaleString()}</Text>
      )}
      <Text>Author: {post.author.username}</Text>
      {userId === post.author.id && (
        <Flex justify='start' gap='1rem'>
          <Button
            disabled={deletePostLoading}
            loading={deletePostLoading}
            onClick={handleDeletePost}
          >
            Delete
          </Button>
          <EditPostModal post={post} />
        </Flex>
      )}
    </Box>
  );
};
