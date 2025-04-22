'use client';

import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { useSignIn } from '@/hooks/auth/useSignIn';
import {
  SignInCredentials,
  SignInCredentialsSchema,
} from '@/models/api/auth.model';

const defaultValues: SignInCredentials = {
  email: '',
  password: '',
};

export function SignInForm() {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        marginTop: '5rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Flex direction='column' width='100%' maxWidth='25rem' gap='1rem'>
        <Heading textAlign='center'>Sign In</Heading>
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
        <Button type='submit' loading={isSubmitting}>
          Continue
        </Button>
      </Flex>
    </form>
  );
}
