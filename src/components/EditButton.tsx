'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';

type EditButtonProps = { label?: string } & ButtonProps;

export const EditButton = ({ label, ...props }: EditButtonProps) => {
  return (
    <Button size='xs' variant='ghost' colorPalette='yellow' {...props}>
      {label ?? 'Edit'} <MdEdit />
    </Button>
  );
};
