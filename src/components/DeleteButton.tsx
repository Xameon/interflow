'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';

export const DeleteButton = (props: ButtonProps) => {
  return (
    <Button size='xs' colorPalette='red' variant='ghost' {...props}>
      Delete <MdDelete />
    </Button>
  );
};
