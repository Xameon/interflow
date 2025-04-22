import { Flex, Link as ChakraLink } from '@chakra-ui/react';
import { NavActions } from './components/NavActions';
import Link from 'next/link';

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
