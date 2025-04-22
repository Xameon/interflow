import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { PostPayload, PostPayloadSchema } from '@/models/posts.model';

// ! This endpoint is unused on client

export const GET = async () => {
  try {
    return NextResponse.json([], { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: 'Failed to fetch posts',
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  const userId = request.headers.get('x-user-id')!;

  const payload = (await request.json()) as PostPayload;

  try {
    PostPayloadSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  const { title, description, imageUrls } = payload;

  try {
    const res = await pool.query(
      `INSERT INTO posts (user_id, title, description) 
      VALUES ($1, $2, $3) 
      RETURNING id`,
      [userId, title, description],
    );

    const postId = res.rows[0].id;

    if (imageUrls && imageUrls.length > 0) {
      const values = imageUrls.map((_, i) => `($1, $${i + 2})`).join(', ');

      await pool.query(
        `INSERT INTO post_images (post_id, image_url) 
        VALUES ${values}`,
        [postId, ...imageUrls],
      );
    }

    return NextResponse.json({ id: postId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create post', error },
      { status: 500 },
    );
  }
};
