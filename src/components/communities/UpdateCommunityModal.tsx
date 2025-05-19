'use client';

import {
  Button,
  Center,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Textarea,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useUpdateCommunity } from '@/hooks/communities/useUpdateCommunity';
import { useUploadFiles } from '@/hooks/firebase/useUploadFiles';
import { Community, UpdateCommunityPayload } from '@/models/communities.model';

import { ImagesUploader } from '../ImagesUploader';
import { SelectCategories } from './SelectCategories';
import { Checkbox } from '../ui/checkbox';
import { Field } from '../ui/field';

type UpdateCommunityModalProps = {
  community: Community;
  opened?: boolean;
  onClose?: () => void;
};

export const UpdateCommunityModal = ({
  community,
  opened,
  onClose,
}: UpdateCommunityModalProps) => {
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
  } = useForm<UpdateCommunityPayload>({
    defaultValues: {
      id: community.id,
      description: community.description,
      avatarUrl: community.avatarUrl,
      categoryIds: community.categories.map(c => c.id),
      onlyAuthorCanPost: community.onlyAuthorCanPost,
    },
  });

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutateAsync: uploadFilesAsync, isPending: uploadingFilesIsLoading } =
    useUploadFiles();

  const {
    mutateAsync: updateCommunityAsync,
    isPending: updateCommunityIsLoading,
  } = useUpdateCommunity({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  // ..................................................
  // Functions

  const onSubmit = async (payload: UpdateCommunityPayload) => {
    if (avatar) {
      payload.avatarUrl = (await uploadFilesAsync([avatar]))[0];
    }

    await updateCommunityAsync(payload);

    onClose?.();
  };

  // ..................................................
  // Variables

  const loading = uploadingFilesIsLoading || updateCommunityIsLoading;

  // ..................................................
  // Render

  return (
    <Dialog.Root
      open={opened}
      size='xl'
      onOpenChange={({ open }) => {
        if (!open) onClose?.();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title color='colorPalette.800'>
                  Edit Community
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body maxH='xl' overflowY='scroll'>
                <Flex gap='1rem' direction='column'>
                  <Field
                    label='Description'
                    invalid={!!errors.description}
                    errorText={errors.description?.message}
                  >
                    <Textarea
                      placeholder='Your Description Here...'
                      {...register('description')}
                      minH='32'
                    />
                  </Field>
                  <Field
                    label='Avatar'
                    invalid={!!errors.avatarUrl}
                    errorText={errors.avatarUrl?.message}
                  >
                    <Center width='full'>
                      <ImagesUploader
                        maxW='xl'
                        alignItems='stretch'
                        maxFiles={1}
                        onFileChange={({ acceptedFiles }) =>
                          setAvatar(acceptedFiles[0])
                        }
                      />
                    </Center>
                  </Field>
                  <Field
                    label='Categories'
                    invalid={!!errors.categoryIds}
                    errorText={errors.categoryIds?.message}
                  >
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
                  </Field>

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
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant='outline'
                    disabled={loading}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button type='submit' disabled={loading} loading={loading}>
                  Save
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size='sm' />
              </Dialog.CloseTrigger>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
