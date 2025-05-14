import qs from 'qs';

import {
  Comment,
  CreateCommentPayload,
  DeleteCommentPayload,
  UpdateCommentPayload,
} from '@/models/comments.model';
import { Post, PostPayload, UpdatePostPayload } from '@/models/posts.model';

import { api } from './api';

// ..................................................
// #region Posts

export type GetPostsParams = {
  userId?: string;
  communityId?: string;
  categoryId?: string[];
};

export const getPosts = async (params?: GetPostsParams) => {
  const res = await api.get<Post[]>('posts', {
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Create Post

export const createPost = async (payload: PostPayload) => {
  const res = await api.post('posts', payload);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region

export const updatePost = async ({ id, ...payload }: UpdatePostPayload) => {
  const res = await api.put(`posts/${id}`, payload);

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

// ..................................................
// #region Comments

export const getComments = async (postId: string) => {
  const res = await api.get<Comment[]>(`posts/${postId}/comments`);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Create Comment

export const createComment = async ({
  postId,
  ...payload
}: CreateCommentPayload) => {
  const res = api.post<{ id: string }>(`posts/${postId}/comments`, payload);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Get Comment

export type GetCommentParams = {
  postId: string;
  commentId: string;
};

export const getComment = async ({ postId, commentId }: GetCommentParams) => {
  const res = await api.get<Comment[]>(`posts/${postId}/comments/${commentId}`);

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Update Comment

export const updateComment = async ({
  postId,
  commentId,
  ...payload
}: UpdateCommentPayload) => {
  const res = await api.put<{ message: string }>(
    `posts/${postId}/comments/${commentId}`,
    payload,
  );

  return res;
};

// #endregion
// ..................................................

// ..................................................
// #region Delete Comment

export const deleteComment = async ({
  postId,
  commentId,
}: DeleteCommentPayload) => {
  await api.delete(`posts/${postId}/comments/${commentId}`);
};

// #endregion
// ..................................................
