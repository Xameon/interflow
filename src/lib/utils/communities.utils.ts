import { Community, DatabaseCommunity } from '@/models/communities.model';

import pool from '../db';

// ..................................................
// #region Get Communities from Database

type GetCommunitiesFromDBParams = {
  userId?: string | null;
  followerId?: string | null;
  categoryIds?: string[] | null;
  authorId?: string | null;
  onlyAuthorCanPost?: boolean | null;
  communityId?: string;
  search?: string | null;
};

export const getCommunitiesFromDB = async ({
  userId,
  followerId,
  categoryIds,
  authorId,
  onlyAuthorCanPost,
  communityId,
  search,
}: GetCommunitiesFromDBParams): Promise<Community[]> => {
  const conditions: string[] = ['c.deleted_at IS NULL'];
  const params: (string | string[] | boolean | null)[] = [];
  let paramIndex = 1;

  const isSubscribedExpr = `
    CASE
      WHEN $${paramIndex}::uuid IS NULL THEN false
      ELSE EXISTS (
        SELECT 1 FROM community_subscriptions cs
        WHERE cs.community_id = c.id AND cs.user_id = $${paramIndex}
      )
    END AS is_subscribed
  `;
  params.push(userId ?? null);
  paramIndex++;

  if (followerId) {
    conditions.push(`
      EXISTS (
        SELECT 1 FROM community_subscriptions fcs
        WHERE fcs.community_id = c.id AND fcs.user_id = $${paramIndex}
      )
    `);
    params.push(followerId);
    paramIndex++;
  }

  if (categoryIds?.length) {
    conditions.push(`
      EXISTS (
        SELECT 1 FROM community_categories cc2
        WHERE cc2.community_id = c.id
        AND cc2.category_id = ANY($${paramIndex}::uuid[])
      )
    `);
    params.push(categoryIds);
    paramIndex++;
  }

  if (authorId) {
    conditions.push(`u.id = $${paramIndex}::uuid`);
    params.push(authorId);
    paramIndex++;
  }

  if (onlyAuthorCanPost != null) {
    conditions.push(`c.only_author_can_post = $${paramIndex}`);
    params.push(onlyAuthorCanPost);
    paramIndex++;
  }

  if (communityId) {
    conditions.push(`c.id = $${paramIndex}`);
    params.push(communityId);
    paramIndex++;
  }

  if (search) {
    conditions.push(`c.title ILIKE '%' || $${paramIndex} || '%'`);
    params.push(search.toLowerCase().trim());
    paramIndex++;
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const query = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.avatar_url,
      c.created_at,
      c.updated_at,
      c.only_author_can_post,
      u.id AS author_id,
      u.name AS author_username,
      u.avatar_url AS author_avatar_url,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', cat.id, 'name', cat.name)
        ) FILTER (WHERE cat.id IS NOT NULL),
        '[]'
      ) AS categories,
      ${isSubscribedExpr}
    FROM communities c
    JOIN users u ON u.id = c.author_id
    LEFT JOIN community_categories cc ON cc.community_id = c.id
    LEFT JOIN categories cat ON cat.id = cc.category_id
    ${whereClause}
    GROUP BY c.id, u.id
    ORDER BY c.created_at DESC;
  `;

  const result = await pool.query<DatabaseCommunity>(query, params);

  return result.rows.map(
    ({
      avatar_url,
      author_id,
      author_username,
      author_avatar_url,
      only_author_can_post,
      is_subscribed,
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
      isSubscribed: is_subscribed,
      createdAt: created_at,
      updatedAt: updated_at,
    }),
  );
};

// #endregion
// ..................................................
