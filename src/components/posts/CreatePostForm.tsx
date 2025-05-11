'use client';

import { Button, Field, Flex, Input, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUploadFiles } from '@/hooks/firebase/useUploadFiles';
import { useCreatePost } from '@/hooks/posts/useCreatePost';
import { PostPayload } from '@/models/posts.model';

import { ImagesUploader } from '../ImagesUploader';

const defaultValues = {
  title: '',
  description: '',
  imageUrls: null,
};

export const CreatePostForm = () => {
  // ..................................................
  // Local States

  const [files, setFiles] = useState<File[]>([]);

  // ..................................................
  // Hook Form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostPayload>({ defaultValues });

  // ..................................................
  // API Hooks

  const { mutateAsync: uploadFilesAsync, isPending: uploadingFilesIsLoading } =
    useUploadFiles();

  const { mutate: createPost, isPending: creatingPostIsLoading } =
    useCreatePost();

  // ..................................................
  // Functions

  const onSubmit = async (payload: PostPayload) => {
    let imageUrls: string[] | null = null;

    if (files.length) {
      imageUrls = await uploadFilesAsync(files);
    }

    createPost({ ...payload, imageUrls });
  };

  // ..................................................
  // Variables

  const loading = uploadingFilesIsLoading || creatingPostIsLoading;

  // ..................................................
  // Render

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap='1rem' direction='column'>
        <Field.Root invalid={!!errors.title}>
          <Field.Label>Title</Field.Label>
          <Input {...register('title', { required: 'Title is Required' })} />
          <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
        </Field.Root>

        <ImagesUploader
          maxW='xl'
          alignItems='stretch'
          maxFiles={10}
          onFileChange={({ acceptedFiles }) => setFiles(acceptedFiles)}
        />

        <Field.Root invalid={!!errors.description}>
          <Field.Label>Description</Field.Label>
          <Textarea
            placeholder='Your Description Here...'
            {...register('description')}
          />
          <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
        </Field.Root>

        <Button type='submit' loading={loading} disabled={loading}>
          Create
        </Button>
      </Flex>
    </form>
  );
};
