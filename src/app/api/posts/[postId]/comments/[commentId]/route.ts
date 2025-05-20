import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import {
  Comment,
  CommentPayload,
  CommentPayloadSchema,
  DatabaseComment,
} from '@/models/comments.model';

// ..................................................
// #region GET Comment Children

export const GET = async (
  req: NextRequest,
  { params }: APIRequestContext<{ postId: string; commentId: string }>,
) => {
  const { postId, commentId } = await params;

  try {
    const result = await pool.query<DatabaseComment>(
      `
      SELECT
        c.id,
        c.post_id,
        c.text,
        c.created_at,
        c.updated_at,
        c.parent_comment_id,
        u.id AS author_id,
        u.name AS author_username,
        u.avatar_url AS author_avatar_url,
        (
          SELECT COUNT(*)
          FROM comments AS children
          WHERE children.parent_comment_id = c.id
        ) AS children_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1 AND c.parent_comment_id = $2
      ORDER BY c.created_at ASC;
      `,
      [postId, commentId],
    );

    const children: Comment[] = result.rows.map(row => ({
      id: row.id,
      postId: row.post_id,
      text: row.text,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      parentCommentId: row.parent_comment_id,
      childrenCount: Number(row.children_count),
      author: {
        id: row.author_id,
        username: row.author_username,
        avatarUrl: row.author_avatar_url,
      },
    }));

    return NextResponse.json(children, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to load child comments', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region PUT Comment

export const PUT = async (
  req: NextRequest,
  { params }: APIRequestContext<{ postId: string; commentId: string }>,
) => {
  const { postId, commentId } = await params;

  const userId = req.headers.get('x-user-id')!;

  const payload = (await req.json()) as CommentPayload;

  try {
    CommentPayloadSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  try {
    const existing = await pool.query<{ user_id: string }>(
      'SELECT user_id FROM comments WHERE post_id = $1 AND id = $2',
      [postId, commentId],
    );

    if (existing.rowCount === 0) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 },
      );
    }

    if (existing.rows[0].user_id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await pool.query(
      'UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2',
      [payload.text, commentId],
    );

    return NextResponse.json(
      { message: 'Comment updated successfully' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating comment', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region DELETE Comment

export const DELETE = async (
  req: NextRequest,
  { params }: APIRequestContext<{ postId: string; commentId: string }>,
) => {
  const { postId, commentId } = await params;

  const userId = req.headers.get('x-user-id')!;

  try {
    const existing = await pool.query<{ user_id: string }>(
      'SELECT user_id FROM comments WHERE post_id = $1 AND id = $2',
      [postId, commentId],
    );

    if (existing.rowCount === 0) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 },
      );
    }

    if (existing.rows[0].user_id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);

    return new Response(null, { status: 204 });
  } catch (e) {
    return NextResponse.json(
      { message: 'Error deleting comment', error: e },
      { status: 500 },
    );
  }
};
// #endregion
// ..................................................
