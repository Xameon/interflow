import { NextResponse } from 'next/server';

import pool from '@/lib/db';

export async function getPostsFromDB() {
  const result = await pool.query(`
    SELECT p.id, p.title, p.description, p.created_at, p.updated_at, u.name AS author
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.deleted_at IS NULL
    ORDER BY p.created_at DESC
  `);
}

export async function GET() {
  try {
    return NextResponse.json(result.rows, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: 'Failed to fetch posts',
      },
      { status: 500 },
    );
  }
}
