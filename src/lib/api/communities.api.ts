import qs from 'qs';

import {
  Category,
  Community,
  CreateCommunityPayload,
  UpdateCommunityPayload,
} from '@/models/communities.model';

import { api } from './api';

// ..................................................
// #region Get Communities

export type GetCommunitiesParams = {
  search?: string | null;
  followerId?: string | null;
  categoryId?: string[] | null;
  authorId?: string | null;
  onlyAuthorCanPost?: boolean | null;
};

export const getCommunities = async (params: GetCommunitiesParams) => {
  const res = await api.get<Community[]>('communities', {
    params,
    paramsSerializer: params =>
      qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true }),
  });

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Create Community

export const createCommunity = async (payload: CreateCommunityPayload) => {
  const res = await api.post<{ id: string }>('communities', payload);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Get Community

export const getCommunity = async (id: string) => {
  const res = await api.get<Community>(`communities/${id}`);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Update Community

export const updateCommunity = async ({
  id,
  ...payload
}: UpdateCommunityPayload) => {
  const res = await api.put<{ message: string }>(`communities/${id}`, payload);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Delete Community

export const deleteCommunity = async (id: string) => {
  await api.delete<void>(`communities/${id}`);
};

// #endregion
// ..................................................

// ..................................................
// #region Get Categories

export const getCategories = async () => {
  const res = await api.get<Category[]>('communities/categories');

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Update Community

// #endregion
// ..................................................

// ..................................................
// #region Delete Community

// #endregion
// ..................................................

// ..................................................
// #region Follow Community

export type FollowCommunityResponse = {
  message: string;
};

export const followCommunity = async (communityId: string) => {
  const res = await api.post<FollowCommunityResponse>(
    `communities/${communityId}/subscriptions`,
  );

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Unfollow Community

export const unfollowCommunity = async (communityId: string) => {
  await api.delete<void>(`communities/${communityId}/subscriptions`);
};

// #endregion
// ..................................................
