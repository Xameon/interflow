'use client';

import {
  Accordion,
  Center,
  Flex,
  For,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';

import { useComment } from '@/hooks/posts/useComment';

import { Comment } from './Comment';
import { EmptyState } from '../ui/empty-state';

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
  // Local States

  const [accordionValue, setAccordionValue] = useState<string[]>([]);

  const opened = accordionValue[0] === 'replies';

  // ..................................................
  // API Hooks

  const { data: commentChildren, isLoading: commentIsLoading } = useComment({
    params: { postId, commentId },
    options: { enabled: opened },
  });

  // ..................................................
  // Functions

  const handleToggleOpened = () => {
    if (opened) {
      setAccordionValue([]);
      return;
    }

    setAccordionValue(['replies']);
  };

  const renderComments = () => {
    if (commentIsLoading)
      return (
        <Center>
          <VStack>
            <Spinner size='sm' color='colorPalette.700' />
            <Text textStyle='sm' color='colorPalette.700'>
              Comments are loading...
            </Text>
          </VStack>
        </Center>
      );

    if (!commentChildren?.length) {
      return (
        <Center>
          <EmptyState
            icon={<MdErrorOutline />}
            title='Oops, something went wrong'
            description="Sorry, we can't display the comments right now. Please try again later."
            size='sm'
          />
        </Center>
      );
    }

    return (
      <Flex direction='column' gap='4' w='full' p='1'>
        <For each={commentChildren}>
          {comment => <Comment key={comment.id} comment={comment} isChild />}
        </For>
      </Flex>
    );
  };

  // ..................................................
  // Render

  return (
    <Accordion.Root
      collapsible
      variant='outline'
      onValueChange={handleToggleOpened}
      pl='4'
    >
      <Accordion.Item value='replies'>
        <Accordion.ItemTrigger display='flex' justifyContent='start'>
          <Text
            textStyle='sm'
            cursor='pointer'
          >{`${!opened ? 'See replies' : 'Hide replies'} (${childrenCount})`}</Text>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody>
            <VStack gap='4'>{renderComments()}</VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};
