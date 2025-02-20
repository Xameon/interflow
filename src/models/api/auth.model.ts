import { z } from 'zod';
import { UserSchema } from './users.model';

// ..................................................
// #region Sign Up Credentials

export const SignUpCredentialsSchema = UserSchema.omit({ id: true });

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Sign In Credentials

export const SignInCredentialsSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type SignInCredentials = z.infer<typeof SignInCredentialsSchema>;

// #endregion
// ..................................................
