import { z } from 'zod';

import { UserSchema } from './users.model';

// ..................................................
// #region Sign Up Credentials

export const SignUpCredentialsSchema = UserSchema.omit({
  id: true,
  createdAt: true,
}).merge(z.object({ password: z.string().min(3) }));

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Sign In Credentials

export const SignInCredentialsSchema = SignUpCredentialsSchema.pick({
  email: true,
  password: true,
});

export type SignInCredentials = z.infer<typeof SignInCredentialsSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Auth Token

export type AuthToken = {
  token: string;
};

// #endregion
// ..................................................
