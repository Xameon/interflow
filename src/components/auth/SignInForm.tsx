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
import { useSignIn } from '@/hooks/auth/useSignIn';
import {
  SignInCredentials,
  SignInCredentialsSchema,
} from '@/models/auth.model';

import { AuthForm } from './styled';

const defaultValues: SignInCredentials = {
  email: '',
  password: '',
};

export const SignInForm = () => {
  // ..................................................
  // Hook Form

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInCredentials>({
    defaultValues,
    resolver: zodResolver(SignInCredentialsSchema),
  });

  // ..................................................
  // API Hooks

  const { mutateAsync: signInAsync } = useSignIn();

  // ..................................................
  // Functions

  const onSubmit = async (payload: SignInCredentials) => {
    const data = await signInAsync(payload);

    localStorage.setItem('token', data.token);
    window.location.replace('/');
  };

  // ..................................................
  // Render

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)} mt='8' mx='auto'>
      <VStack gap='4'>
        <Heading
          textAlign='center'
          textStyle='2xl'
          fontWeight='bolder'
          color='colorPalette.700'
        >
          Sign In
        </Heading>
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
        {"Don't have an account? "}
        <ChakraLink asChild color='colorPalette.600'>
          <Link href='/sign-up'>Sign Up</Link>
        </ChakraLink>
      </Text>
      <Button type='submit' loading={isSubmitting}>
        Continue
      </Button>
    </AuthForm>
  );
};
