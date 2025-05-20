import { Button, Drawer, IconButton, Portal, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

import { CloseButton } from '@/components/ui/close-button';

export const MobileHeader = () => {
  const [opened, setOpened] = useState<boolean>(false);

  const handleClose = () => setOpened(false);

  return (
    <Drawer.Root
      placement='start'
      open={opened}
      onOpenChange={({ open }) => setOpened(open)}
    >
      <Drawer.Trigger asChild>
        <IconButton variant='ghost'>
          <RxHamburgerMenu />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Interflow</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack gap='4' mt='32'>
                <Button
                  asChild
                  variant='subtle'
                  size='lg'
                  w='full'
                  onClick={handleClose}
                >
                  <Link href='/posts' prefetch>
                    Posts
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='subtle'
                  size='lg'
                  w='full'
                  onClick={handleClose}
                >
                  <Link href='/communities' prefetch>
                    Communities
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='subtle'
                  size='lg'
                  w='full'
                  onClick={handleClose}
                >
                  <Link href='/users' prefetch>
                    Search Users
                  </Link>
                </Button>
              </VStack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
