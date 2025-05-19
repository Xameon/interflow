import { z } from 'zod';

// ..................................................
// #region Create Community

export const CreateCommunityPayloadSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  avatarUrl: z.string().url().nullable(),
  categoryIds: z.array(z.string().uuid()),
  onlyAuthorCanPost: z.boolean(),
});

export type CreateCommunityPayload = z.infer<
  typeof CreateCommunityPayloadSchema
>;

// #endregion
// ..................................................

// ..................................................
// #region Database Community

export const DatabaseCommunitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  only_author_can_post: z.boolean(),
  author_id: z.string().uuid(),
  author_username: z.string(),
  author_avatar_url: z.string().url().nullable(),
  is_subscribed: z.boolean(),
  categories: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  ),
});

export type DatabaseCommunity = z.infer<typeof DatabaseCommunitySchema>;

// #endregion
// ..................................................

// ..................................................
// #region Category

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

// #endregion
// ..................................................

// ..................................................
// #region Community

export const CommunitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  onlyAuthorCanPost: z.boolean(),
  isSubscribed: z.boolean(),
  author: z.object({
    id: z.string().uuid(),
    username: z.string(),
    avatarUrl: z.string().url().nullable(),
  }),
  categories: z.array(CategorySchema),
});

export type Community = z.infer<typeof CommunitySchema>;

// #endregion
// ..................................................
