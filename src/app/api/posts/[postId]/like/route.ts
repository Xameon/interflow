import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';

// ..................................................
// #region Like

export const POST = async (
  request: NextRequest,
  { params }: APIRequestContext<{ postId: string }>,
) => {
  const userId = request.headers.get('x-user-id')!;

  const { postId } = await params;

  try {
    await pool.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)
       ON CONFLICT (user_id, post_id) DO NOTHING`,
      [userId, postId],
    );

    return NextResponse.json({ message: 'Post liked' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error liking post', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region Remove Like

export const DELETE = async (
  request: NextRequest,
  { params }: APIRequestContext<{ postId: string }>,
) => {
  const userId = request.headers.get('x-user-id')!;
  const { postId } = await params;

  try {
    await pool.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`, [
      userId,
      postId,
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error removing like', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
