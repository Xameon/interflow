import { NextResponse } from 'next/server';

import pool from '@/lib/db';
import { Category } from '@/models/communities.model';

export const GET = async () => {
  try {
    const result = await pool.query<Category>(`
      SELECT id, name
      FROM categories
      ORDER BY name ASC
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch categories', error },
      { status: 500 },
    );
  }
};
