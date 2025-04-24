'use client';

import { Button, Field, Flex, Input, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useCreatePost } from '@/hooks/posts/useCreatePost';
import { PostPayload } from '@/models/posts.model';

const defaultValues = {
  title: '',
  description: '',
  imageUrls: null,
};

export const CreatePostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostPayload>({ defaultValues });

  const { mutate: createPost, isPending: creatingPostIsLoading } =
    useCreatePost();

  const onSubmit = (payload: PostPayload) => {
    createPost(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap='1rem' direction='column'>
        <Field.Root invalid={!!errors.title}>
          <Field.Label>Title</Field.Label>
          <Input {...register('title', { required: 'Title is Required' })} />
          <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.description}>
          <Field.Label>Description</Field.Label>
          <Textarea
            placeholder='Your Description Here...'
            {...register('description')}
          />
          <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type='submit'
          loading={creatingPostIsLoading}
          disabled={creatingPostIsLoading}
        >
          Create
        </Button>
      </Flex>
    </form>
  );
};
