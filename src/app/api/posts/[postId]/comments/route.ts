import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import {
  Comment,
  CommentPayload,
  CommentPayloadSchema,
} from '@/models/comments.model';

export const GET = async (
  req: NextRequest,
  { params }: APIRequestContext<{ postId: string }>,
) => {
  const { postId } = await params;

  try {
    const result = await pool.query(
      `
      SELECT
        c.id,
        c.post_id,
        c.text,
        c.created_at,
        c.updated_at,
        c.parent_comment_id,
        u.id AS author_id,
        u.name AS username,
        u.avatar_url AS avatar_url,
        (
          SELECT COUNT(*)
          FROM comments AS children
          WHERE children.parent_comment_id = c.id
        ) AS children_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1 AND c.parent_comment_id IS NULL
      ORDER BY c.created_at ASC;
      `,
      [postId],
    );

    const comments: Comment[] = result.rows.map(row => ({
      id: row.id,
      postId: row.post_id,
      text: row.text,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      parentCommentId: row.parent_comment_id,
      childrenCount: Number(row.children_count),
      author: {
        id: row.author_id,
        username: row.username,
        avatarUrl: row.avatar_url,
      },
    }));

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to load comments', error },
      { status: 500 },
    );
  }
};

export const POST = async (
  request: NextRequest,
  { params }: APIRequestContext<{ postId: string }>,
) => {
  const userId = request.headers.get('x-user-id')!;
  const { postId } = await params;
  const payload = (await request.json()) as CommentPayload;

  try {
    CommentPayloadSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  const { text, parentCommentId } = payload;

  try {
    const result = await pool.query(
      `
      INSERT INTO comments (user_id, post_id, text, parent_comment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at, updated_at
      `,
      [userId, postId, text, parentCommentId ?? null],
    );

    return NextResponse.json(
      {
        id: result.rows[0].id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating comment', error },
      { status: 500 },
    );
  }
};
