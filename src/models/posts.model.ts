import { z } from 'zod';

// ..................................................
// #region Post

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  userId: z.string().uuid('Invalid user ID'),
  imageUrls: z.array(z.string()).optional(),
});

export type Post = z.infer<typeof PostSchema>;

// #endregion
// ..................................................

// ..................................................
// #region Database Post

// #endregion
// ..................................................
