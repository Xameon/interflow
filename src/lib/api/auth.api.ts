import {
  AuthToken,
  SignInCredentials,
  SignUpCredentials,
} from '@/models/auth.model';

import { api } from './api';

// ..................................................
// #region Authorization

export const auth = async () => {
  const res = await api.get<{ userId: string }>('auth');

  return res.data;
};

// #endregion
// ..................................................

// ..................................................
// #region Sign Up

export const signUp = async (payload: SignUpCredentials) => {
  const res = await api.post<AuthToken>('auth/sign-up', payload);

  return res.data;
};

// #endregion
// ..................................................

// ..................................................
// #region Sign In

export const signIn = async (payload: SignInCredentials) => {
  const res = await api.post<AuthToken>('auth/sign-in', payload);

  return res.data;
};

// #endregion
// ..................................................

// ..................................................
// #region Logout

export const logout = async () => {
  await api.post('auth/logout');
};

// #endregion
// ..................................................
