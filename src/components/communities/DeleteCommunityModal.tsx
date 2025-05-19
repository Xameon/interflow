'use client';

import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { useDeleteCommunity } from '@/hooks/communities/useDeleteCommunity';

type DeleteCommunityModalProps = {
  communityId: string;
  opened?: boolean;
  onClose?: () => void;
};

export const DeleteCommunityModal = ({
  communityId,
  opened,
  onClose,
}: DeleteCommunityModalProps) => {
  // ..................................................
  // API Hooks

  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteCommunityAsync,
    isPending: deleteCommunityIsLoading,
  } = useDeleteCommunity({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  // ..................................................
  // Misc Hooks

  const router = useRouter();

  const pathname = usePathname();
  const isOnCommunityPage = pathname?.startsWith('/communities/');

  // ..................................................
  // Functions

  const handleDeleteCommunity = async () => {
    await deleteCommunityAsync(communityId);

    if (isOnCommunityPage) {
      await router.replace('/communities');
    }

    onClose?.();
  };

  // ..................................................
  // Render

  return (
    <Dialog.Root
      role='alertdialog'
      open={opened}
      onOpenChange={({ open }) => {
        if (!open) onClose?.();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                This action cannot be undone. This action will also soft-delete
                all posts associated with the community. This operation cannot
                be undone.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant='outline'
                  disabled={deleteCommunityIsLoading}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette='red'
                onClick={handleDeleteCommunity}
                disabled={deleteCommunityIsLoading}
                loading={deleteCommunityIsLoading}
              >
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
