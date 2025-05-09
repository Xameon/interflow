'use client';

import { Button, Flex, For, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { useComment } from '@/hooks/posts/useComment';
import { useAuthContext } from '@/hooks/useAuthContext';

import { CommentText } from './CommentText';

type CommentsChildrenProps = {
  postId: string;
  commentId: string;
  childrenCount: number;
};

export const CommentsChildren = ({
  postId,
  commentId,
  childrenCount,
}: CommentsChildrenProps) => {
  // ..................................................
  // Contexts

  const { userId } = useAuthContext();

  // ..................................................
  // Local States

  const [opened, setOpened] = useState<boolean>(false);

  // ..................................................
  // API Hooks

  const { data: commentChildren } = useComment({
    params: { postId, commentId },
    options: { enabled: opened },
  });

  // ..................................................
  // Functions

  const handleToggleOpened = () => setOpened(prev => !prev);

  // ..................................................
  // Render

  return (
    <Flex direction='column' gap='0.5rem' padding='1rem'>
      <Button onClick={handleToggleOpened}>
        {!opened ? `See replies (${childrenCount})` : 'Hide replies'}
      </Button>
      {opened && commentChildren && (
        <For each={commentChildren}>
          {child => (
            <Flex key={child.id} direction='column' gap='0.5rem'>
              <CommentText
                postId={child.postId}
                commentId={child.id}
                commentAuthorId={child.author.id}
                text={child.text}
              />
              <Text>Author: {child.author.username}</Text>
              <Text>Created: {child.createdAt}</Text>
              <Text>Updated: {child.updatedAt}</Text>
              {userId === child.author.id && (
                <Button w='fit-content' colorPalette='red'>
                  Delete
                </Button>
              )}
            </Flex>
          )}
        </For>
      )}
    </Flex>
  );
};
