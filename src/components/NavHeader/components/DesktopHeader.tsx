import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export const DesktopHeader = () => {
  return (
    <Flex w='full' maxW='6xl' justify='space-between' gap='4'>
      <Flex gap='1rem'>
        <Button asChild variant='plain' size='lg'>
          <Link href='/posts' prefetch>
            Posts
          </Link>
        </Button>
        <Button asChild variant='plain' size='lg'>
          <Link href='/communities' prefetch>
            Communities
          </Link>
        </Button>
        <Button asChild variant='plain' size='lg'>
          <Link href='/users' prefetch>
            Search Users
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};
