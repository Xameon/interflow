import { Post } from '@/models/posts.model';

import { api } from './api';

// ..................................................
// #region Posts

export const getPosts = async () => {
  const res = await api.get<Post[]>('/posts');

  return res;
};

// #endregion
// ..................................................
