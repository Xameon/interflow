import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import {
  Community,
  CreateCommunityPayload,
  CreateCommunityPayloadSchema,
  DatabaseCommunity,
} from '@/models/communities.model';

// ..................................................
// #region GET Communities

const getCommunitiesFromDB = async (): Promise<Community[]> => {
  const result = await pool.query<DatabaseCommunity>(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.avatar_url,
        c.created_at,
        c.only_author_can_post,
        u.id AS author_id,
        u.name AS author_username,
        u.avatar_url AS author_avatar_url,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', cat.id, 'name', cat.name)
          ) FILTER (WHERE cat.id IS NOT NULL),
          '[]'
        ) AS categories
      FROM communities c
      JOIN users u ON u.id = c.author_id
      LEFT JOIN community_categories cc ON cc.community_id = c.id
      LEFT JOIN categories cat ON cat.id = cc.category_id
      WHERE c.deleted_at IS NULL
      GROUP BY c.id, u.id
      ORDER BY c.created_at DESC;
    `);

  return result.rows.map(
    ({
      avatar_url,
      author_id,
      author_username,
      author_avatar_url,
      only_author_can_post,
      created_at,
      updated_at,
      ...dbCommunity
    }) => ({
      ...dbCommunity,
      avatarUrl: avatar_url,
      author: {
        id: author_id,
        username: author_username,
        avatarUrl: author_avatar_url,
      },
      onlyAuthorCanPost: only_author_can_post,
      createdAt: created_at,
      updatedAt: updated_at,
    }),
  );
};

export const GET = async () => {
  try {
    const communities = await getCommunitiesFromDB();

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
