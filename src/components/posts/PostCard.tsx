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
import { useDislikePost } from '@/hooks/posts/useDislikePost';
import { useLikePost } from '@/hooks/posts/useLikePost';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Post } from '@/models/posts.model';

import { CommentsModal } from './CommentsModal';
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

  const { mutate: likePost, isPending: likeLoading } = useLikePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const { mutate: dislikePost, isPending: dislikeLoading } = useDislikePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

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

  const toggleLike = async () => {
    if (!post.isLiked) {
      likePost(post.id);
      return;
    }
    dislikePost(post.id);
  };

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
      <Text>Likes: {post.likesCount}</Text>
      <Flex justify='start' gap='1rem'>
        <CommentsModal postId={post.id} commentsCount={post.commentsCount} />
        <Button
          disabled={likeLoading || dislikeLoading}
          loading={likeLoading || dislikeLoading}
          onClick={toggleLike}
        >
          {post.isLiked ? 'Dislike' : 'Like'}
        </Button>
        {userId === post.author.id && (
          <>
            <Button
              disabled={deletePostLoading}
              loading={deletePostLoading}
              onClick={handleDeletePost}
            >
              Delete
            </Button>
            <EditPostModal post={post} />
          </>
        )}
      </Flex>
    </Box>
  );
};
