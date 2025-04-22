import { api } from './api';

import { User } from '@/models/users.model';

// ..................................................
// #region Get User By ID

export const getUser = async (id: string) => {
  const res = await api.get<User>(`/users/${id}`);

  return res;
};

// #endregion
// ..................................................
