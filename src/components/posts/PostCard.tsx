'use client';

import {
  Badge,
  Blockquote,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa6';

import { useDeletePost } from '@/hooks/posts/useDeletePost';
import { useDislikePost } from '@/hooks/posts/useDislikePost';
import { useLikePost } from '@/hooks/posts/useLikePost';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Post } from '@/models/posts.model';

import { CommentsModal } from './CommentsModal';
import { EditPostModal } from './EditPostModal';
import { CommunityLabel } from '../CommunityLabel';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { ImageCarousel } from '../ImageCarousel';
import { Tooltip } from '../ui/tooltip';
import { UserLabel } from '../UserLabel';

type PostCardProps = {
  post: Post;
};

const getLikesLabel = (count: number) =>
  `${count} like${count === 1 ? '' : 's'}`;

const getCommentsLabel = (count: number) =>
  `${count} comment${count === 1 ? '' : 's'}`;

export const PostCard = ({ post }: PostCardProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [postEditorOpened, setPostEditorOpened] = useState<boolean>(false);
  const [commentsOpened, setCommentsOpened] = useState<boolean>(false);

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
  // Variables

  const hasImages = !!post.imageUrls?.length;

  // ..................................................
  // Render

  return (
    <>
      <Flex
        direction='column'
        css={{
          rounded: 'lg',
          shadow: 'sm',
          justifyContent: 'start',
          w: 'full',
          maxW: '2xl',
          position: 'relative',
        }}
      >
        {post.imageUrls && <ImageCarousel images={post.imageUrls} />}
        {hasImages ? (
          <Heading
            css={{
              position: 'absolute',
              top: '4',
              left: '4',
              py: '1',
              px: '3',
              rounded: 'md',
              color: 'colorPalette.900',
              bg: 'rgba(255, 255, 255, 0.7)',
              boxShadow: 'md',
              backdropFilter: 'blur(2px)',
            }}
          >
            {post.title}
          </Heading>
        ) : (
          <Heading p='4' color='colorPalette.900'>
            {post.title}
          </Heading>
        )}
        <Flex direction='column' gap='4' p='4' pt={hasImages ? '4' : '0'}>
          {!!post.description && (
            <Blockquote.Root variant='solid'>
              <Blockquote.Content>{post.description}</Blockquote.Content>
            </Blockquote.Root>
          )}
          <Stack
            direction={{ base: 'row', mdDown: 'column' }}
            justify='space-between'
            gap='4'
          >
            <HStack gap='4'>
              <UserLabel
                userId={post.author.id}
                username={post.author.username}
                avatarUrl={post.author.avatarUrl}
              />
              {post.community && (
                <CommunityLabel
                  communityId={post.community.id}
                  communityTitle={post.community.title}
                  communityAvatarUrl={post.community.avatarUrl}
                />
              )}
            </HStack>
            <HStack gap='1'>
              <Tooltip content={new Date(post.updatedAt).toLocaleString()}>
                <Badge colorPalette='gray' size='lg'>
                  {post.createdAt === post.updatedAt ? (
                    new Date(post.createdAt).toLocaleDateString()
                  ) : (
                    <>
                      <Badge size='md' color='fg.muted'>
                        updated
                      </Badge>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </>
                  )}
                </Badge>
              </Tooltip>
              {userId === post.author.id && (
                <>
                  <EditButton onClick={() => setPostEditorOpened(true)} />
                  <DeleteButton
                    disabled={deletePostLoading}
                    loading={deletePostLoading}
                    onClick={handleDeletePost}
                  />
                </>
              )}
            </HStack>
          </Stack>
          <HStack>
            <HStack gap='1'>
              <IconButton
                disabled={likeLoading || dislikeLoading}
                onClick={toggleLike}
                variant='plain'
              >
                <Icon color='red.500' size='lg' asChild>
                  {post.isLiked ? <FaHeart /> : <FaRegHeart />}
                </Icon>
              </IconButton>
              <Text w='10' textStyle='sm'>
                {getLikesLabel(post.likesCount)}
              </Text>
            </HStack>
            <HStack gap='1'>
              <IconButton
                variant='plain'
                onClick={() => setCommentsOpened(true)}
              >
                <Icon color='colorPalette.950' size='lg' asChild>
                  <FaRegComment />
                </Icon>
              </IconButton>
              <Text textStyle='sm'>{getCommentsLabel(post.commentsCount)}</Text>
            </HStack>
          </HStack>
        </Flex>
      </Flex>
      <CommentsModal
        opened={commentsOpened}
        postId={post.id}
        onClose={() => setCommentsOpened(false)}
      />
      <EditPostModal
        opened={postEditorOpened}
        post={post}
        onClose={() => setPostEditorOpened(false)}
      />
    </>
  );
};
