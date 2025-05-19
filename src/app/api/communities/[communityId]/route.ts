import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { getCommunitiesFromDB } from '@/lib/utils/communities.utils';
import { APIRequestContext } from '@/models';
import {
  UpdateCommunityPayload,
  UpdateCommunityPayloadSchema,
} from '@/models/communities.model';

// ..................................................
// #region GET

export const GET = async (
  req: NextRequest,
  { params }: APIRequestContext<{ communityId: string }>,
) => {
  const userId = req.headers.get('x-user-id');
  const { communityId } = await params;

  try {
    const communities = await getCommunitiesFromDB({ userId, communityId });

    const community = communities.at(0);

    if (!community) {
      return NextResponse.json(
        { message: 'Community not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(community, { status: 200 });
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

export const PUT = async (
  req: NextRequest,
  { params }: APIRequestContext<{ communityId: string }>,
) => {
  const userId = req.headers.get('x-user-id')!;

  const { communityId } = await params;

  const payload = (await req.json()) as UpdateCommunityPayload;

  try {
    UpdateCommunityPayloadSchema.omit({ id: true }).parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  try {
    await pool.query('BEGIN');

    const res = await pool.query(
      `SELECT * FROM communities WHERE id = $1 AND deleted_at IS NULL`,
      [communityId],
    );

    const community = res.rows.at(0);

    if (!community) {
      await pool.query('ROLLBACK');

      return NextResponse.json(
        { message: 'Community not found' },
        { status: 404 },
      );
    }

    if (community.author_id !== userId) {
      await pool.query('ROLLBACK');

      return NextResponse.json(
        { message: 'Permission denied' },
        { status: 403 },
      );
    }

    await pool.query(
      `
      UPDATE communities
      SET description = $1,
          avatar_url = $2,
          only_author_can_post = $3,
          updated_at = NOW()
      WHERE id = $4
    `,
      [
        payload.description,
        payload.avatarUrl,
        payload.onlyAuthorCanPost,
        communityId,
      ],
    );

    await pool.query(
      `DELETE FROM community_categories WHERE community_id = $1`,
      [communityId],
    );

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

    await pool.query('COMMIT');

    return NextResponse.json(
      { message: 'Community updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    await pool.query('ROLLBACK');

    return NextResponse.json(
      { message: 'Error during update community', error },
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
  { params }: APIRequestContext<{ communityId: string }>,
) => {
  const userId = req.headers.get('x-user-id')!;

  const { communityId } = await params;

  try {
    await pool.query('BEGIN');

    const res = await pool.query(
      `SELECT * FROM communities WHERE id = $1 AND deleted_at IS NULL`,
      [communityId],
    );

    const community = res.rows.at(0);

    if (!community) {
      await pool.query('ROLLBACK');

      return NextResponse.json(
        { message: 'Community not found' },
        { status: 404 },
      );
    }

    if (community.author_id !== userId) {
      await pool.query('ROLLBACK');

      return NextResponse.json(
        { message: 'Permission denied' },
        { status: 403 },
      );
    }

    await pool.query(
      `UPDATE communities SET deleted_at = NOW() WHERE id = $1`,
      [communityId],
    );

    await pool.query(
      `UPDATE posts SET deleted_at = NOW() WHERE community_id = $1`,
      [communityId],
    );

    await pool.query(
      `DELETE FROM community_subscriptions WHERE community_id = $1`,
      [communityId],
    );

    await pool.query('COMMIT');

    return new Response(null, { status: 204 });
  } catch (error) {
    await pool.query('ROLLBACK');

    return NextResponse.json(
      { message: 'Error during update community', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
