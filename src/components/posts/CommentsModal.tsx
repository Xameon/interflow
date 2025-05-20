'use client';

import {
  Button,
  Center,
  Dialog,
  Flex,
  For,
  Icon,
  Input,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LuSearchX } from 'react-icons/lu';
import { MdErrorOutline } from 'react-icons/md';

import { useCreatePostComment } from '@/hooks/posts/useCreatePostComment';
import { usePostComments } from '@/hooks/posts/usePostComments';
import { useAuthContext } from '@/hooks/useAuthContext';

import { Comment } from './Comment';
import { CloseButton } from '../ui/close-button';
import { EmptyState } from '../ui/empty-state';

type CommentsModalProps = {
  opened?: boolean;
  postId: string;
  onClose: () => void;
};

export const CommentsModal = ({
  opened,
  postId,
  onClose,
}: CommentsModalProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [commentText, setCommentText] = useState<string>('');

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { data: comments, isLoading: commentsIsLoading } = usePostComments({
    params: { postId },
    options: { enabled: opened },
  });

  const { mutate: createComment, isPending: commentCreationIsLoading } =
    useCreatePostComment({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['posts', 'comments', { postId }],
        });

        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      },
    });

  // ..................................................
  // Functions

  const renderComments = () => {
    if (commentsIsLoading)
      return (
        <Center h='full'>
          <VStack>
            <Spinner size='xl' color='colorPalette.700' />
            <Text textStyle='xl' color='colorPalette.700'>
              Comments are loading...
            </Text>
          </VStack>
        </Center>
      );

    if (!comments) {
      return (
        <Center h='full'>
          <EmptyState
            icon={<MdErrorOutline />}
            title='Oops, something went wrong'
            description="Sorry, we can't display the comments right now. Please try again later."
            size='lg'
          />
        </Center>
      );
    }

    if (!comments.length) {
      return (
        <Center h='full'>
          <EmptyState
            icon={
              <Icon asChild>
                <LuSearchX />
              </Icon>
            }
            title='There are no comments yet'
            description='However, you can write the first comment below.'
            size='lg'
          />
        </Center>
      );
    }

    return (
      <Flex direction='column' gap='4'>
        <For each={comments ?? []}>
          {comment => <Comment key={comment.id} comment={comment} />}
        </For>
      </Flex>
    );
  };

  // ..................................................
  // Render

  return (
    <Dialog.Root
      size='xl'
      placement='center'
      open={opened}
      onOpenChange={({ open }) => {
        if (!open) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content h='3/4' minH='35rem'>
            <Dialog.Header>
              <Dialog.Title color='colorPalette.900'>Comments</Dialog.Title>
              <Dialog.CloseTrigger
                position='absolute'
                top='0.5rem'
                right='0.5rem'
                asChild
              >
                <CloseButton size='sm' />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body overflowY='auto'>{renderComments()}</Dialog.Body>
            {userId && (
              <Dialog.Footer>
                <form
                  style={{ width: '100%', display: 'flex', gap: '1rem' }}
                  onSubmit={e => {
                    e.preventDefault();
                    createComment({ postId, text: commentText });
                    setCommentText('');
                  }}
                >
                  <Input
                    w='full'
                    placeholder='Your comment here...'
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  />
                  <Button
                    type='submit'
                    disabled={commentCreationIsLoading || !commentText}
                    loading={commentsIsLoading || commentCreationIsLoading}
                  >
                    Comment
                  </Button>
                </form>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
