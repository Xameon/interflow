import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import { DatabaseUser, User } from '@/models/users.model';

export async function GET(
  _: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) {
  const id = (await params).id;

  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

  const user = res.rows[0] as DatabaseUser | undefined;

  if (!user)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  const { id: userId, name, email, avatar_url, created_at } = user;

  return NextResponse.json<User>({
    id: userId,
    name,
    email,
    avatarUrl: avatar_url,
    createdAt: created_at,
  });
}
