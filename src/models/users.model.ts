import { z } from 'zod';

// ..................................................
// #region User

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  isFollowed: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Database User Schema

export const DatabaseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  avatar_url: z.string().nullable(),
  created_at: z.string().datetime(),
});

export type DatabaseUser = z.infer<typeof DatabaseUserSchema>;

// #endregion
// ..................................................

// ..................................................
// #region User Metadata

export const UserMetadataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
});

export type UserMetadata = z.infer<typeof UserMetadataSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Database User Stats

export const DatabaseUserStatsSchema = z.object({
  followers_count: z.number(),
  following_count: z.number(),
  communities_count: z.number(),
  followed_communities_count: z.number(),
});

export type DatabaseUserStats = z.infer<typeof DatabaseUserStatsSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Database User Stats

export const UserStatsSchema = z.object({
  userId: z.string().uuid(),
  followersCount: z.number(),
  followingCount: z.number(),
  communitiesCount: z.number(),
  followedCommunitiesCount: z.number(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Update User Payload

export const UpdateUserPayloadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
});

export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;

// #endregion
// ..................................................
