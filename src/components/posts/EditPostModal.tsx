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

import { useUpdatePost } from '@/hooks/posts/useUpdatePost';
import { Post, UpdatePostPayload } from '@/models/posts.model';

import { CloseButton } from '../ui/close-button';

type EditPostModalProps = {
  post: Post;
  opened?: boolean;
  onClose?: () => void;
};

export const EditPostModal = ({
  post,
  opened,
  onClose,
}: EditPostModalProps) => {
  // ..................................................
  // Hooks Form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePostPayload>({
    defaultValues: {
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrls: post.imageUrls,
    },
  });

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutateAsync: updatePostAsync, isPending: updatePostIsLoading } =
    useUpdatePost({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });

  // ..................................................
  // Functions

  const onSubmit = async (payload: UpdatePostPayload) => {
    await updatePostAsync(payload);

    onClose?.();
  };

  // ..................................................
  // Render

  return (
    <Dialog.Root
      open={opened}
      initialFocusEl={() => null}
      onExitComplete={onClose}
      onOpenChange={({ open }) => {
        if (!open) onClose?.();
      }}
      size='lg'
      unmountOnExit
    >
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
                      minH='36'
                      maxH='xs'
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
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
