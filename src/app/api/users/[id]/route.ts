import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import {
  DatabaseUser,
  UpdateUserPayloadSchema,
  User,
} from '@/models/users.model';

// ..................................................
// #region GET

export const GET = async (
  req: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) => {
  const currentUserId = req.headers.get('x-user-id');
  const targetUserId = (await params).id;

  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [
      targetUserId,
    ]);

    const user = res.rows[0] as DatabaseUser | undefined;

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let isFollowed = false;

    if (currentUserId && currentUserId !== targetUserId) {
      const subscriptionCheck = await pool.query(
        `
      SELECT 1 FROM subscriptions
      WHERE follower_id = $1 AND following_id = $2
      LIMIT 1
      `,
        [currentUserId, targetUserId],
      );

      isFollowed = (subscriptionCheck?.rowCount || 0) > 0;
    }

    const { id: userId, name, email, avatar_url, created_at } = user;

    return NextResponse.json<User>({
      id: userId,
      name,
      email,
      avatarUrl: avatar_url,
      createdAt: created_at,
      isFollowed,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to get user', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region PUT

const PutPayloadSchema = UpdateUserPayloadSchema.omit({ id: true });

type PutPayload = z.infer<typeof PutPayloadSchema>;

export const PUT = async (
  req: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) => {
  const currentUserId = req.headers.get('x-user-id')!;
  const targetUserId = (await params).id;

  if (currentUserId !== targetUserId) {
    return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
  }

  const payload = (await req.json()) as PutPayload;

  try {
    PutPayloadSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [
      targetUserId,
    ]);

    const user = res.rows[0] as DatabaseUser | undefined;

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const result = await pool.query<{ id: string }>(
      `
        UPDATE users
        SET name = $1, avatar_url = $2
        WHERE id = $3
        RETURNING id;
      `,
      [payload.name, payload.avatarUrl, user.id],
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update user', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
