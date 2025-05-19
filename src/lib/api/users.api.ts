import { UpdateUserPayload, User, UserStats } from '@/models/users.model';

import { api } from './api';

// ..................................................
// #region Get User By ID

export const getUser = async (id: string) => {
  const res = await api.get<User>(`/users/${id}`);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Update User

export const updateUser = async ({ id, ...payload }: UpdateUserPayload) => {
  const res = await api.put<{ id: string }>(`users/${id}`, payload);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Get User Stats

export const getUserStats = async (id: string) => {
  const res = await api.get<UserStats>(`/users/${id}/stats`);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Follow

export const followUser = async (id: string) => {
  const res = await api.post<{ success: boolean }>(
    `/users/${id}/subscriptions`,
  );

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Unfollow

export const unfollowUser = async (id: string) => {
  await api.delete<void>(`/users/${id}/subscriptions`);
};

// #endregion
// ..................................................
