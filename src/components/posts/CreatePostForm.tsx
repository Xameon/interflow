'use client';

import { Button, Flex, Input, Textarea } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useUploadFiles } from '@/hooks/firebase/useUploadFiles';
import { useCreatePost } from '@/hooks/posts/useCreatePost';
import { PostPayload } from '@/models/posts.model';

import { ImagesUploader } from '../ImagesUploader';
import { SelectUserCommunities } from './SelectUserCommunities';
import { Field } from '../ui/field';

const defaultValues = {
  title: '',
  description: '',
  imageUrls: null,
  communityId: null,
};

export const CreatePostForm = () => {
  // ..................................................
  // Local States

  const [files, setFiles] = useState<File[]>([]);

  // ..................................................
  // Hook Form

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostPayload>({ defaultValues });

  // ..................................................
  // API Hooks

  const { mutateAsync: uploadFilesAsync, isPending: uploadingFilesIsLoading } =
    useUploadFiles();

  const { mutateAsync: createPostAsync, isPending: creatingPostIsLoading } =
    useCreatePost();

  // ..................................................
  // Misc Hooks

  const router = useRouter();

  // ..................................................
  // Functions

  const onSubmit = async (payload: PostPayload) => {
    let imageUrls: string[] | null = null;

    if (files.length) {
      imageUrls = await uploadFilesAsync(files);
    }

    await createPostAsync({ ...payload, imageUrls });

    router.push('/posts');
  };

  // ..................................................
  // Variables

  const loading = uploadingFilesIsLoading || creatingPostIsLoading;

  // ..................................................
  // Render

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap='1rem' direction='column'>
        <Field
          invalid={!!errors.title}
          label='Title'
          errorText={errors.title?.message}
        >
          <Input {...register('title', { required: 'Title is Required' })} />
        </Field>

        <Field
          invalid={!!errors.description}
          label='Description'
          errorText={errors.description?.message}
        >
          <Textarea
            placeholder='Your Description Here...'
            {...register('description')}
          />
        </Field>

        <Field label='Community'>
          <Controller
            control={control}
            name='communityId'
            render={({ field }) => (
              <SelectUserCommunities
                onChange={value => field.onChange(value)}
              />
            )}
          />
        </Field>

        <ImagesUploader
          maxW='xl'
          alignItems='stretch'
          maxFiles={5}
          onFileChange={({ acceptedFiles }) => setFiles(acceptedFiles)}
        />

        <Button type='submit' loading={loading} disabled={loading}>
          Create
        </Button>
      </Flex>
    </form>
  );
};
