'use client';

import {
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { useSignUp } from '@/hooks/auth/useSignUp';
import {
  SignUpCredentials,
  SignUpCredentialsSchema,
} from '@/models/auth.model';

import { AuthForm } from './styled';

const defaultValues: SignUpCredentials = {
  name: '',
  email: '',
  password: '',
  avatarUrl: null,
};

export const SignUpForm = () => {
  // ..................................................
  // Hook Form

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>({
    defaultValues,
    resolver: zodResolver(SignUpCredentialsSchema),
  });

  // ..................................................
  // API Hooks

  const { mutateAsync: signUpAsync } = useSignUp();

  // ..................................................
  // Functions

  const onSubmit = async (payload: SignUpCredentials) => {
    const data = await signUpAsync(payload);

    localStorage.setItem('token', data.token);
    window.location.replace('/');
  };

  // ..................................................
  // Render

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)} mt='8' mx='auto'>
      <Heading
        textAlign='center'
        textStyle='2xl'
        fontWeight='bolder'
        color='colorPalette.700'
      >
        Sign Up
      </Heading>
      <VStack gap='4'>
        <Field
          label='Name'
          invalid={!!errors.name}
          errorText={errors.name?.message}
        >
          <Input {...register('name')} type='name' />
        </Field>
        <Field
          label='Email'
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Input {...register('email')} type='email' />
        </Field>
        <Field
          label='Password'
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput {...register('password')} />
        </Field>
      </VStack>
      <Text textAlign='center' fontSize='sm' color='gray.600'>
        {'Already have an account? '}
        <ChakraLink asChild color='colorPalette.600'>
          <Link href='/sign-in'>Sign In</Link>
        </ChakraLink>
      </Text>
      <Button type='submit' loading={isSubmitting}>
        Continue
      </Button>
    </AuthForm>
  );
};
