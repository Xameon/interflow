'use client';

import {
  Button,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
  Textarea,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MdEdit } from 'react-icons/md';

import { useUpdatePost } from '@/hooks/posts/useUpdatePost';
import { Post, UpdatePostPayload } from '@/models/posts.model';

type EditPostModalProps = {
  post: Post;
};

export const EditPostModal = ({ post }: EditPostModalProps) => {
  // ..................................................
  // Hooks Form

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePostPayload>({ defaultValues: post });

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutate: updatePost, isPending: updatePostIsLoading } = useUpdatePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // ..................................................
  // Functions

  const onSubmit = (payload: UpdatePostPayload) => {
    updatePost(payload);
  };

  // ..................................................
  // Render

  return (
    <Dialog.Root initialFocusEl={() => null} onExitComplete={reset}>
      <Dialog.Trigger asChild>
        <Button size='xs' variant='ghost' colorPalette='yellow'>
          Edit <MdEdit />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>Edit Post</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Flex gap='1rem' direction='column'>
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>Title</Field.Label>
                    <Input
                      {...register('title', { required: 'Title is Required' })}
                    />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.description}>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                      placeholder='Your Description Here...'
                      {...register('description')}
                    />
                    <Field.ErrorText>
                      {errors.description?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button disabled={updatePostIsLoading} variant='outline'>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  disabled={updatePostIsLoading}
                  loading={updatePostIsLoading}
                  type='submit'
                >
                  Save
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
