import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import {
  DatabasePostRow,
  PostPayload,
  PostPayloadSchema,
} from '@/models/posts.model';

// ..................................................
// #region Put Post

export const PUT = async (
  request: NextRequest,
  { params }: APIRequestContext<{ postId: string }>,
) => {
  const { postId } = await params;
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
    await pool.query('BEGIN');

    const existing = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [postId],
    );

    if (existing.rowCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (existing.rows[0].user_id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await pool.query(
      'UPDATE posts SET title = $1, description = $2, updated_at = NOW() WHERE id = $3',
      [title, description, postId],
    );

    await pool.query('DELETE FROM post_images WHERE post_id = $1', [postId]);

    if (imageUrls && imageUrls.length > 0) {
      const values = imageUrls.map((_, i) => `($1, $${i + 2})`).join(', ');

      await pool.query(
        `INSERT INTO post_images (post_id, image_url) 
        VALUES ${values}`,
        [postId, ...imageUrls],
      );
    }

    await pool.query('COMMIT');

    return NextResponse.json(
      { message: 'Post updated successfully' },
      { status: 201 },
    );
  } catch (e) {
    await pool.query('ROLLBACK');

    return NextResponse.json(
      { message: 'Error updating post', error: e },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region Delete Post

export const DELETE = async (
  request: NextRequest,
  { params }: APIRequestContext<{ postId: string }>,
) => {
  const { postId } = await params;
  const userId = request.headers.get('x-user-id')!;

  const result = await pool.query<DatabasePostRow>(
    `SELECT * FROM posts
    WHERE id = $1 AND deleted_at IS NULL`,
    [postId],
  );

  const post = result.rows[0];

  if (!post) {
    return NextResponse.json(
      { message: 'No post found with this ID' },
      { status: 404 },
    );
  }

  if (post.user_id !== userId) {
    return NextResponse.json('No rights to delete', { status: 403 });
  }

  await pool.query('UPDATE posts SET deleted_at = NOW() WHERE id = $1', [
    postId,
  ]);

  return new Response(null, { status: 204 });
};

// #endregion
// ..................................................
