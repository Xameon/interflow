import { Flex, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

import { NavActions } from './components/NavActions';

export function NavHeader() {
  return (
    <Flex justify='space-between'>
      <ChakraLink asChild>
        <Link href='/'>Home</Link>
      </ChakraLink>
      <NavActions />
    </Flex>
  );
}
