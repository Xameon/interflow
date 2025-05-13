'use client';

import {
  Button,
  Flex,
  Group,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { useCreatePostComment } from '@/hooks/posts/useCreatePostComment';
import { useDeleteComment } from '@/hooks/posts/useDeleteComment';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Comment as IComment } from '@/models/comments.model';

import { CommentsChildren } from './CommentsChildren';
import { CommentText } from './CommentText';
import { Avatar } from '../ui/avatar';

type CommentProps = {
  comment: IComment;
  isChild?: boolean;
};

export const Comment = ({ comment, isChild }: CommentProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [replyInputOpened, setReplyInputOpened] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const {
    mutate: createCommentReplyAsync,
    isPending: commentReplyCreationIsLoading,
  } = useCreatePostComment({
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
    <Flex key={comment.id} direction='column' gap='0.5rem'>
      <VStack align='start'>
        <HStack>
          <Avatar
            src={comment.author.avatarUrl ?? undefined}
            variant='subtle'
            colorPalette='gray'
            size='xs'
          />
          <Text fontWeight='medium'>{comment.author.username}</Text>
        </HStack>
        <HStack w='full' justify='space-between' align='start'>
          <CommentText
            postId={comment.postId}
            commentId={comment.id}
            commentAuthorId={comment.author.id}
            text={comment.text}
          />
          {userId === comment.author.id && (
            <IconButton
              size='xs'
              variant='ghost'
              colorPalette='red'
              onClick={() =>
                deleteComment({ postId: comment.postId, commentId: comment.id })
              }
            >
              <Icon asChild>
                <MdDelete />
              </Icon>
            </IconButton>
          )}
          {userId && !isChild && (
            <Button
              size='xs'
              variant='ghost'
              onClick={() => setReplyInputOpened(prev => !prev)}
            >
              {!replyInputOpened ? 'Reply' : 'Cancel'}
            </Button>
          )}
        </HStack>
      </VStack>

      {comment.childrenCount > 0 && (
        <CommentsChildren
          postId={comment.postId}
          commentId={comment.id}
          childrenCount={comment.childrenCount}
        />
      )}
      {!isChild && (
        <form
          onSubmit={async e => {
            e.preventDefault();

            await createCommentReplyAsync({
              text: replyText,
              postId: comment.postId,
              parentCommentId: comment.id,
            });

            setReplyText('');
          }}
        >
          {replyInputOpened && (
            <Group w='full'>
              <Input
                placeholder='Your reply here...'
                variant='flushed'
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <IconButton
                size='xs'
                type='submit'
                variant='ghost'
                disabled={!replyText || commentReplyCreationIsLoading}
                loading={commentReplyCreationIsLoading}
              >
                <Icon asChild>
                  <FaReply />
                </Icon>
              </IconButton>
            </Group>
          )}
        </form>
      )}
    </Flex>
  );
};
