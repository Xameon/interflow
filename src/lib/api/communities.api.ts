import { Community, CreateCommunityPayload } from '@/models/communities.model';

import { api } from './api';

// ..................................................
// #region Get Communities

export const getCommunities = async () => {
  const res = await api.get<Community[]>('communities');

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
