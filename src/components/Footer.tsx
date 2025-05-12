import { Box, Flex, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box
      as='footer'
      py='6'
      mt='12'
      borderTop='1px solid'
      borderColor='gray.200'
      bg='colorPalette.50'
    >
      <Flex justify='center' align='center' direction='column' gap='1'>
        <Text fontSize='sm' color='gray.600' textAlign='center'>
          This website is a graduation project by Andriy Shmalenko.
        </Text>
        <Text fontSize='xs' color='gray.500' textAlign='center'>
          © {new Date().getFullYear()} All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};
