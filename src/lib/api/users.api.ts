import { User } from '@/models/users.model';

import { api } from './api';

// ..................................................
// #region Get User By ID

export const getUser = async (id: string) => {
  const res = await api.get<User>(`/users/${id}`);

  return res;
};

// #endregion
// ..................................................
