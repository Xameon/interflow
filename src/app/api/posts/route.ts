import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import {
  DatabasePost,
  Post,
  PostPayload,
  PostPayloadSchema,
} from '@/models/posts.model';

// ..................................................
// #region Get Post

const getPostsFromDB = async (userId: string | null): Promise<Post[]> => {
  const result = await pool.query(
    `
    SELECT
  p.id,
  p.title,
  p.description,
  p.created_at,
  p.updated_at,
  u.name AS author_name,
  u.avatar_url AS author_avatar_url,
  u.id AS author_id,
  (
    SELECT json_agg(image_url)
    FROM post_images
    WHERE post_id = p.id
  ) AS image_urls,
  (
    SELECT COUNT(*)::int
    FROM likes
    WHERE post_id = p.id
  ) AS likes_count,
  (
    SELECT COUNT(*)::int
    FROM comments
    WHERE post_id = p.id
  ) AS comments_count,
  EXISTS (
    SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1
  ) AS is_liked
FROM posts p
JOIN users u ON u.id = p.user_id
WHERE p.deleted_at IS NULL
ORDER BY p.created_at DESC;
`,
    [userId],
  );

  return (result.rows as DatabasePost[]).map(dbPost => {
    const {
      author_id,
      author_avatar_url,
      author_name,
      created_at,
      updated_at,
      image_urls,
      likes_count,
      comments_count,
      is_liked,
      ...restData
    } = dbPost;

    return {
      ...restData,
      author: {
        id: author_id,
        avatarUrl: author_avatar_url,
        username: author_name,
      },
      createdAt: created_at.toISOString(),
      updatedAt: updated_at.toISOString(),
      commentsCount: comments_count,
      likesCount: likes_count,
      imageUrls: image_urls,
      isLiked: is_liked,
    };
  });
};

export const GET = async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id');

  try {
    const posts = await getPostsFromDB(userId);

    return NextResponse.json(posts, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: 'Failed to fetch posts',
      },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region Create Post

export const POST = async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id')!;

  const payload = (await request.json()) as PostPayload;

  try {
    PostPayloadSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  const { title, description, imageUrls } = payload;

  try {
    const res = await pool.query(
      `INSERT INTO posts (user_id, title, description) 
      VALUES ($1, $2, $3) 
      RETURNING id`,
      [userId, title, description],
    );

    const postId = res.rows[0].id;

    if (imageUrls && imageUrls.length > 0) {
      const values = imageUrls.map((_, i) => `($1, $${i + 2})`).join(', ');

      await pool.query(
        `INSERT INTO post_images (post_id, image_url) 
        VALUES ${values}`,
        [postId, ...imageUrls],
      );
    }

    return NextResponse.json({ id: postId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create post', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
