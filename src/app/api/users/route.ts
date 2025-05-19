import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { DatabaseUser } from '@/models/users.model';

// ..................................................
// #region GET

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const nameFilter = searchParams.get('name');

  try {
    const values: (string | null)[] = [];
    let whereClause = '';

    if (nameFilter) {
      values.push(`%${nameFilter}%`);
      whereClause += `WHERE name ILIKE $1`;
    }

    const res = await pool.query<DatabaseUser>(
      `SELECT id, name, avatar_url FROM users ${whereClause}`,
      values,
    );

    const users = res.rows.map(user => ({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar_url,
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch users', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
