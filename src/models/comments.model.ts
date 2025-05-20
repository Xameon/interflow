import { z } from 'zod';

// ..................................................
// #region Database Comment

export const DatabaseCommentSchema = z.object({
  id: z.string().uuid(),
  author_id: z.string().uuid(),
  author_username: z.string(),
  author_avatar_url: z.string().nullable(),
  post_id: z.string().uuid(),
  text: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  parent_comment_id: z.string().uuid().nullish(),
  children_count: z.number(),
});

export type DatabaseComment = z.infer<typeof DatabaseCommentSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Comment

export const CommentSchema = z.object({
  id: z.string().uuid(),
  author: z.object({
    id: z.string().uuid(),
    username: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  postId: z.string().uuid(),
  text: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  childrenCount: z.number(),
});

export type Comment = z.infer<typeof CommentSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Comment Payload

export const CommentPayloadSchema = z.object({
  text: z.string(),
  parentCommentId: z.string().uuid().nullish(),
});

export type CommentPayload = z.infer<typeof CommentPayloadSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Create Comment Payload

export const CreateCommentPayloadSchema = CommentPayloadSchema.merge(
  z.object({
    postId: z.string().uuid(),
  }),
);

export type CreateCommentPayload = z.infer<typeof CreateCommentPayloadSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Update Comment Payload

export const UpdateCommentPayloadSchema = z.object({
  postId: z.string().uuid(),
  commentId: z.string().uuid(),
  text: z.string(),
});

export type UpdateCommentPayload = z.infer<typeof UpdateCommentPayloadSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Delete Comment Payload

export const DeleteCommentPayloadSchema = z.object({
  postId: z.string().uuid(),
  commentId: z.string().uuid(),
});

export type DeleteCommentPayload = z.infer<typeof DeleteCommentPayloadSchema>;

// #endregion
// ..................................................
