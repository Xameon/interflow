import { Box, BoxProps } from '@chakra-ui/react';

export const Divider = (props: BoxProps) => {
  return <Box w='full' h='1px' bg='gray.200' opacity={0.6} {...props} />;
};
