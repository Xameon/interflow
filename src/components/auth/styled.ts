import { chakra } from '@chakra-ui/react';

export const AuthForm = chakra('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6',
    p: '6',
    rounded: 'lg',
    w: 'full',
    maxW: 'sm',
    boxShadow: 'sm',
  },
});
