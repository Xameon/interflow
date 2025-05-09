'use client';

import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useCreatePostComment } from '@/hooks/posts/useCreatePostComment';
import { useDeleteComment } from '@/hooks/posts/useDeleteComment';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Comment as IComment } from '@/models/comments.model';

import { CommentsChildren } from './CommentsChildren';
import { CommentText } from './CommentText';

type CommentProps = {
  comment: IComment;
};

export const Comment = ({ comment }: CommentProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [replyText, setReplyText] = useState<string>('');

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutate: createComment } = useCreatePostComment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', 'comments', { postId: comment.postId }],
      });
    },
  });

  const { mutate: deleteComment } = useDeleteComment({
    onSuccess: () => {
      const { id, postId } = comment;

      queryClient.invalidateQueries({
        queryKey: ['posts', 'comments', { postId, commentId: id }],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', 'comments', { postId }],
      });
    },
  });

  // ..................................................
  // Render

  return (
    <Flex key={comment.id} direction='column' gap='0.5rem' bg='orange.50'>
      <CommentText
        postId={comment.postId}
        commentId={comment.id}
        commentAuthorId={comment.author.id}
        text={comment.text}
      />
      <Text>Author: {comment.author.username}</Text>
      <Text>Created: {comment.createdAt}</Text>
      <Text>Updated: {comment.updatedAt}</Text>
      {comment.childrenCount > 0 && (
        <CommentsChildren
          postId={comment.postId}
          commentId={comment.id}
          childrenCount={comment.childrenCount}
        />
      )}
      <form
        onSubmit={e => {
          e.preventDefault();

          createComment({
            text: replyText,
            postId: comment.postId,
            parentCommentId: comment.id,
          });
        }}
      >
        {userId && (
          <Flex gap='1rem'>
            <Input
              placeholder='Reply'
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <Button type='submit'>Reply</Button>
          </Flex>
        )}
      </form>
      {userId === comment.author.id && (
        <Button
          w='fit-content'
          colorPalette='red'
          onClick={() =>
            deleteComment({ postId: comment.postId, commentId: comment.id })
          }
        >
          Delete
        </Button>
      )}
    </Flex>
  );
};
