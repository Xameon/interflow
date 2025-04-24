import { Post, PostPayload, UpdatePostPayload } from '@/models/posts.model';

import { api } from './api';

// ..................................................
// #region Posts

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

// ..................................................
// #region

export const updatePost = async ({ id, ...payload }: UpdatePostPayload) => {
  const res = await api.put(`/posts/${id}`, payload);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Delete Post

export const deletePost = async (id: string) => {
  await api.delete(`posts/${id}`);
};

// #endregion
// ..................................................

// ..................................................
// #region Like Post

export const likePost = async (postId: string) => {
  await api.post(`posts/${postId}/like`);
};

// #endregion
// ..................................................

// ..................................................
// #region Like Post

export const dislikePost = async (postId: string) => {
  await api.delete(`posts/${postId}/like`);
};

// #endregion
// ..................................................
