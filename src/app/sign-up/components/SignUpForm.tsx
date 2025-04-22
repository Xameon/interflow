'use client';

import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { useSignUp } from '@/hooks/auth/useSignUp';
import {
  SignUpCredentials,
  SignUpCredentialsSchema,
} from '@/models/api/auth.model';

const defaultValues: SignUpCredentials = {
  name: '',
  email: '',
  password: '',
  avatarUrl: null,
};

export function SignUpForm() {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        marginTop: '5rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Flex direction='column' width='100%' maxWidth='25rem' gap='1rem'>
        <Heading textAlign='center'>Sign Up</Heading>
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
        <Button type='submit' loading={isSubmitting}>
          Continue
        </Button>
      </Flex>
    </form>
  );
}
