import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';

export const POST = async (
  req: NextRequest,
  { params }: APIRequestContext<{ communityId: string }>,
) => {
  const userId = req.headers.get('x-user-id')!;
  const { communityId } = await params;

  try {
    await pool.query(
      `
      INSERT INTO community_subscriptions (user_id, community_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
      `,
      [userId, communityId],
    );

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: APIRequestContext<{ communityId: string }>,
) => {
  const userId = req.headers.get('x-user-id')!;
  const { communityId } = await params;

  try {
    const authorResult = await pool.query<{ author_id: string }>(
      `
      SELECT author_id FROM communities
      WHERE id = $1 AND deleted_at IS NULL;
      `,
      [communityId],
    );

    if (authorResult.rowCount === 0) {
      return NextResponse.json(
        { message: 'Community not found' },
        { status: 404 },
      );
    }

    const { author_id } = authorResult.rows[0];

    if (userId === author_id) {
      return NextResponse.json(
        { message: 'Author cannot unsubscribe from their own community.' },
        { status: 400 },
      );
    }

    await pool.query(
      `
      DELETE FROM community_subscriptions
      WHERE user_id = $1 AND community_id = $2;
      `,
      [userId, communityId],
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 },
    );
  }
};
