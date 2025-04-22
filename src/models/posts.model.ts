import { z } from 'zod';

// ..................................................
// #region Post

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z.object({
    username: z.string(),
    avatar: z.string().nullable(),
  }),
  imageUrls: z.array(z.string()).nullable(),
  likesCount: z.string(),
  commentsCount: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Post Payload

export const PostPayloadSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrls: z.array(z.string()).nullable(),
});

export type PostPayload = z.infer<typeof PostPayloadSchema>;

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
  author_avatar: z.string().nullable(),
  image_urls: z.array(z.string()).nullable(),
  likes_count: z.string(),
  comments_count: z.string(),
});

export type DatabasePost = z.infer<typeof DatabasePostSchema>;

// #endregion
// ..................................................
