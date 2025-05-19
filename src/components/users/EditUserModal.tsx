'use client';

import { Button, Dialog, Flex, Input, Portal } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUploadFiles } from '@/hooks/firebase/useUploadFiles';
import { useUpdateUser } from '@/hooks/users/useUpdateUser';
import { UpdateUserPayload, User } from '@/models/users.model';

import { ImagesUploader } from '../ImagesUploader';
import { CloseButton } from '../ui/close-button';
import { Field } from '../ui/field';

type EditUserModalProps = {
  user: User;
  opened?: boolean;
  onClose?: () => void;
};

export const EditUserModal = ({
  user,
  opened,
  onClose,
}: EditUserModalProps) => {
  // ..................................................
  // Local States

  const [files, setFiles] = useState<File[]>([]);

  // ..................................................
  // Hooks Form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserPayload>({
    defaultValues: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  });

  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const { mutateAsync: uploadFilesAsync, isPending: uploadingFilesIsLoading } =
    useUploadFiles();

  const { mutateAsync: updateUserAsync, isPending: updateUserIsLoading } =
    useUpdateUser({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users', { id: user.id }] });
      },
    });

  // ..................................................
  // Functions

  const onSubmit = async (payload: UpdateUserPayload) => {
    let avatarUrl: string | null = null;

    if (files.at(0)) {
      const urls = await uploadFilesAsync(files);
      avatarUrl = urls[0];
    }

    await updateUserAsync({ ...payload, avatarUrl });

    onClose?.();
  };

  // ..................................................
  // Variables

  const loading = uploadingFilesIsLoading || updateUserIsLoading;

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
                <Dialog.Title>Edit Profile</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Flex gap='1rem' direction='column'>
                  <Field
                    invalid={!!errors.name}
                    label='Name'
                    errorText={errors.name?.message}
                  >
                    <Input
                      {...register('name', { required: 'Name is Required' })}
                    />
                  </Field>
                  <ImagesUploader
                    maxW='full'
                    alignItems='stretch'
                    maxFiles={1}
                    onFileChange={({ acceptedFiles }) =>
                      setFiles(acceptedFiles)
                    }
                  />
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button disabled={loading} variant='outline'>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button disabled={loading} loading={loading} type='submit'>
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
