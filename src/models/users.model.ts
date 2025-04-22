import { z } from 'zod';

// ..................................................
// #region User

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
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
