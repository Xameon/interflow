'use client';

import { Button, Flex, Heading, Input, Textarea } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useCreateCommunity } from '@/hooks/communities/useCreateCommunity';
import { useUploadFiles } from '@/hooks/firebase/useUploadFiles';
import { CreateCommunityPayload } from '@/models/communities.model';

import { ImagesUploader } from '../ImagesUploader';
import { SelectCategories } from './SelectCategories';
import { Checkbox } from '../ui/checkbox';
import { Field } from '../ui/field';

const defaultValues: CreateCommunityPayload = {
  title: '',
  description: '',
  avatarUrl: null,
  categoryIds: [],
  onlyAuthorCanPost: true,
};

export const CreateCommunityForm = () => {
  // ..................................................
  // Local States

  const [avatar, setAvatar] = useState<File | null>(null);

  // ..................................................
  // Hook Form

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommunityPayload>({
    defaultValues,
  });

  // ..................................................
  // API Hooks

  const { mutateAsync: uploadFilesAsync, isPending: uploadingFilesIsLoading } =
    useUploadFiles();

  const {
    mutateAsync: createCommunityAsync,
    isPending: creatingCommunityIsLoading,
  } = useCreateCommunity();

  // ..................................................
  // Misc Hooks

  const router = useRouter();

  // ..................................................
  // Functions

  const onSubmit = async (payload: CreateCommunityPayload) => {
    let avatarUrl: string | null = null;

    if (avatar) {
      avatarUrl = (await uploadFilesAsync([avatar]))[0];
    }

    const res = await createCommunityAsync({ ...payload, avatarUrl });

    router.push(`/communities/${res.data.id}`);
  };

  // ..................................................
  // Variables

  const loading = uploadingFilesIsLoading || creatingCommunityIsLoading;

  // ..................................................
  // Render

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading color='colorPalette.900' my='4'>
        New Community
      </Heading>
      <Flex gap='1rem' direction='column'>
        <Field
          label='Title'
          invalid={!!errors.title}
          errorText={errors.title?.message}
        >
          <Input {...register('title', { required: 'Title is Required' })} />
        </Field>

        <ImagesUploader
          maxW='xl'
          alignItems='stretch'
          maxFiles={1}
          onFileChange={({ acceptedFiles }) => setAvatar(acceptedFiles[0])}
        />

        <Field
          label='Description'
          invalid={!!errors.description}
          errorText={errors.description?.message}
        >
          <Textarea
            placeholder='Your Description Here...'
            {...register('description')}
          />
        </Field>

        <Controller
          control={control}
          name='categoryIds'
          render={({ field }) => (
            <SelectCategories
              value={field.value}
              onChange={category => {
                const updatedValue = field.value.filter(
                  id => id !== category.id,
                );

                if (!category.included) {
                  updatedValue.push(category.id);
                }

                field.onChange(updatedValue);
              }}
            />
          )}
        />

        <Controller
          control={control}
          name='onlyAuthorCanPost'
          render={({ field }) => (
            <Checkbox
              checked={!field.value}
              onCheckedChange={({ checked }) => {
                field.onChange(!checked);
              }}
            >
              Allow members to post
            </Checkbox>
          )}
        />

        <Button type='submit' loading={loading} disabled={loading}>
          Create
        </Button>
      </Flex>
    </form>
  );
};
