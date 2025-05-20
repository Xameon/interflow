import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { getCommunitiesFromDB } from '@/lib/utils/communities.utils';
import {
  Community,
  CreateCommunityPayload,
  CreateCommunityPayloadSchema,
} from '@/models/communities.model';

// ..................................................
// #region GET Communities

export const GET = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);

  const authorId = searchParams.get('authorId');
  const followerId = searchParams.get('followerId');

  let onlyAuthorCanPost = null;

  const onlyAuthorCanPostParam = searchParams.get('onlyAuthorCanPost');

  if (onlyAuthorCanPostParam === 'true') {
    onlyAuthorCanPost = true;
  }

  if (onlyAuthorCanPostParam === 'false') {
    onlyAuthorCanPost = false;
  }

  const categoryIds = searchParams.getAll('categoryId');

  const search = searchParams.get('search');

  try {
    const communities = await getCommunitiesFromDB({
      search,
      userId,
      authorId,
      categoryIds,
      followerId,
      onlyAuthorCanPost,
    });

    return NextResponse.json<Community[]>(communities, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch communities', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region POST Community

export const POST = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id')!;
  const payload = (await req.json()) as CreateCommunityPayload;

  try {
    CreateCommunityPayloadSchema.parse(payload);
  } catch {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 422 });
  }

  try {
    await pool.query('BEGIN');

    const result = await pool.query(
      `
      INSERT INTO communities (title, description, avatar_url, author_id, only_author_can_post)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
      `,
      [
        payload.title,
        payload.description,
        payload.avatarUrl,
        userId,
        payload.onlyAuthorCanPost,
      ],
    );

    const communityId = result.rows[0].id as string;

    if (payload.categoryIds.length > 0) {
      const values: string[] = [];
      const params: string[] = [];

      payload.categoryIds.forEach((categoryId, index) => {
        const paramIdx = index * 2;

        values.push(`($${paramIdx + 1}, $${paramIdx + 2})`);
        params.push(communityId, categoryId);
      });

      const insertQuery = `
        INSERT INTO community_categories (community_id, category_id)
        VALUES ${values.join(', ')}
        ON CONFLICT DO NOTHING;
      `;

      await pool.query(insertQuery, params);
    }

    await pool.query(
      `
      INSERT INTO community_subscriptions (user_id, community_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
      `,
      [userId, communityId],
    );

    await pool.query('COMMIT');

    return NextResponse.json({ id: communityId }, { status: 201 });
  } catch (error) {
    await pool.query('ROLLBACK');
    return NextResponse.json(
      { message: 'Failed to create community', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
