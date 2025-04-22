// ..................................................
// #region Get User By ID

import { User } from '@/models/api/users.model';
import { api } from './api';

export const getUser = async (id: string) => {
  const res = await api.get<User>(`/users/${id}`);

  return res;
};

// #endregion
// ..................................................
