import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';

// ..................................................
// #region POST

export const POST = async (
  req: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) => {
  const followerId = req.headers.get('x-user-id')!;

  const { id: followingId } = await params;

  if (!followingId || followerId === followingId) {
    return NextResponse.json({ message: 'Invalid user IDs' }, { status: 400 });
  }

  try {
    await pool.query(
      `
      INSERT INTO subscriptions (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [followerId, followingId],
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to follow', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region DELETE

export const DELETE = async (
  req: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) => {
  const followerId = req.headers.get('x-user-id')!;

  const { id: followingId } = await params;

  if (followerId === followingId) {
    return NextResponse.json({ message: 'Invalid user IDs' }, { status: 400 });
  }

  try {
    await pool.query(
      `
      DELETE FROM subscriptions
      WHERE follower_id = $1 AND following_id = $2
      `,
      [followerId, followingId],
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to unfollow', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
