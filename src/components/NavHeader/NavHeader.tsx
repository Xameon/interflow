import { Flex, Button } from '@chakra-ui/react';
import Link from 'next/link';

import { NavActions } from './components/NavActions';

export const NavHeader = () => {
  return (
    <Flex
      as='header'
      css={{
        justifyContent: 'center',
        w: 'full',
        p: '4',
        position: 'sticky',
        boxShadow: 'sm',
        roundedBottom: 'md',
      }}
    >
      <Flex w='full' maxW='1440px' justify='space-between' gap='4'>
        <Flex gap='1rem'>
          <Button asChild variant='plain' size='lg'>
            <Link href='/'>Home</Link>
          </Button>
          <Button asChild variant='plain' size='lg'>
            <Link href='/posts'>Posts</Link>
          </Button>
          <Button asChild variant='plain' size='lg'>
            <Link href='/communities'>Communities</Link>
          </Button>
        </Flex>
        <NavActions />
      </Flex>
    </Flex>
  );
};
