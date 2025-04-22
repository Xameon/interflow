import { Post, PostPayload } from '@/models/posts.model';

import { api } from './api';

// ..................................................
// #region Posts

// ! This endpoint is unused on client

export const getPosts = async () => {
  const res = await api.get<Post[]>('/posts');

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Create Post

export const createPost = async (payload: PostPayload) => {
  const res = await api.post('/posts', payload);

  return res;
};

// #endregion
// ..................................................
