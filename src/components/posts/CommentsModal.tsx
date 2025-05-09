'use client';

import { Button, Dialog, For, Input, Portal, Progress } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useCreatePostComment } from '@/hooks/posts/useCreatePostComment';
import { usePostComments } from '@/hooks/posts/usePostComments';
import { useAuthContext } from '@/hooks/useAuthContext';

import { Comment } from './Comment';
import { CloseButton } from '../ui/close-button';

type CommentsModalProps = {
  postId: string;
  commentsCount: number;
};

export const CommentsModal = ({
  postId,
  commentsCount,
}: CommentsModalProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [opened, setOpened] = useState(false);
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
  // Render

  return (
    <Dialog.Root
      size='xl'
      placement='center'
      open={opened}
      onOpenChange={({ open }) => setOpened(open)}
    >
      <Dialog.Trigger asChild>
        <Button>Comments: {commentsCount}</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content h='75%' minH='35rem'>
            <Dialog.Header>
              <Dialog.Title>Comments</Dialog.Title>
              <Dialog.CloseTrigger
                position='absolute'
                top='0.5rem'
                right='0.5rem'
                asChild
              >
                <CloseButton size='sm' />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body
              overflowY='auto'
              display='flex'
              flexDirection='column'
              gap='1rem'
            >
              {commentsIsLoading ? (
                <Progress.Root value={null}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              ) : (
                <For each={comments ?? []}>
                  {comment => <Comment key={comment.id} comment={comment} />}
                </For>
              )}
            </Dialog.Body>
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
                    loading={commentCreationIsLoading}
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
