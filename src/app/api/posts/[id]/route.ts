import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import { DatabasePostRow } from '@/models/posts.model';

export const DELETE = async (
  request: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) => {
  const { id } = await params;
  const userId = request.headers.get('x-user-id')!;

  const result = await pool.query<DatabasePostRow>(
    `SELECT * FROM posts
    WHERE id = $1 AND deleted_at IS NULL`,
    [id],
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

  await pool.query('UPDATE posts SET deleted_at = NOW() WHERE id = $1', [id]);

  return new Response(null, { status: 204 });
};
