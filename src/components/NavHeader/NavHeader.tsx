import { Flex, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

import { NavActions } from './components/NavActions';

export const NavHeader = () => {
  return (
    <Flex justify='space-between'>
      <Flex gap='1rem'>
        <ChakraLink asChild>
          <Link href='/'>Home</Link>
        </ChakraLink>
        <ChakraLink asChild>
          <Link href='/posts'>Posts</Link>
        </ChakraLink>
        <ChakraLink asChild>
          <Link href='/posts/new'>Create Post</Link>
        </ChakraLink>
      </Flex>
      <NavActions />
    </Flex>
  );
};
