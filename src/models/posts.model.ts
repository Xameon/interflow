import { z } from 'zod';

// ..................................................
// #region Post

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.object({
    id: z.string().uuid(),
    username: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  imageUrls: z.array(z.string()).nullable(),
  likesCount: z.number(),
  commentsCount: z.number(),
  isLiked: z.boolean(),
});

export type Post = z.infer<typeof PostSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Create Post Payload

export const PostPayloadSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()).nullable(),
});

export type PostPayload = z.infer<typeof PostPayloadSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Update Post Payload

export const UpdatePostPayloadSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()).nullable(),
});

export type UpdatePostPayload = z.infer<typeof UpdatePostPayloadSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Database Post

export const DatabasePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  author_name: z.string(),
  author_avatar_url: z.string().nullable(),
  author_id: z.string().uuid(),
  image_urls: z.array(z.string()).nullable(),
  likes_count: z.number(),
  comments_count: z.number(),
  is_liked: z.boolean(),
});

export type DatabasePost = z.infer<typeof DatabasePostSchema>;

export const DatabasePostRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

export type DatabasePostRow = z.infer<typeof DatabasePostRowSchema>;

// #endregion
// ..................................................
