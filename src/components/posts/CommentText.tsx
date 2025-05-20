'use client';

import { Editable, IconButton, Text, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LuCheck, LuPencilLine, LuX } from 'react-icons/lu';

import { useUpdateComment } from '@/hooks/posts/useUpdateComment';
import { useAuthContext } from '@/hooks/useAuthContext';

type CommentTextProps = {
  postId: string;
  commentId: string;
  commentAuthorId: string;
  text: string;
};

export const CommentText = ({
  postId,
  commentId,
  commentAuthorId,
  text,
}: CommentTextProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [commentText, setCommentText] = useState<string>(text);

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutate: updateComment } = useUpdateComment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', 'comments', { postId, commentId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'comments', { postId }],
      });
    },
  });

  // ..................................................
  // Render

  if (userId !== commentAuthorId) {
    return (
      <VStack justify='center' minH='8'>
        <Text>{text}</Text>
      </VStack>
    );
  }

  return (
    <Editable.Root
      value={commentText}
      onValueChange={({ value }) => setCommentText(value)}
      onInteractOutside={() => {
        setCommentText(text);
      }}
      maxW='full'
      alignItems='start'
    >
      <Editable.Preview w='full' />
      <Editable.Textarea h='4' />
      <Editable.Control>
        <Editable.EditTrigger asChild>
          <IconButton variant='ghost' size='xs'>
            <LuPencilLine />
          </IconButton>
        </Editable.EditTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton variant='outline' size='xs'>
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
        <Editable.SubmitTrigger asChild>
          <IconButton
            variant='outline'
            size='xs'
            onClick={() =>
              updateComment({ postId, commentId, text: commentText })
            }
          >
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>
    </Editable.Root>
  );
};
