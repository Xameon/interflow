import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import {
  DatabasePost,
  Post,
  PostPayload,
  PostPayloadSchema,
} from '@/models/posts.model';

// ..................................................
// #region Get Posts

type GetPostsFromDB = {
  headerUserId: string | null;
  authorId: string | null;
  communityId: string | null;
  categoryIds: string[] | null;
};

const getPostsFromDB = async ({
  headerUserId,
  authorId,
  communityId,
  categoryIds,
}: GetPostsFromDB): Promise<Post[]> => {
  const values: (string | null)[] = [headerUserId];
  let paramIndex = 2;
  const filters: string[] = [];

  if (authorId) {
    filters.push(`p.user_id = $${paramIndex}`);
    values.push(authorId);
    paramIndex++;
  }

  if (communityId) {
    filters.push(`p.community_id = $${paramIndex}`);
    values.push(communityId);
    paramIndex++;
  }

  let joinCategoryFilter = '';
  if (categoryIds && categoryIds.length > 0) {
    const placeholders = categoryIds
      .map((_, i) => `$${paramIndex + i}`)
      .join(', ');
    joinCategoryFilter = `
      JOIN community_categories cc ON cc.community_id = p.community_id
      AND cc.category_id IN (${placeholders})
    `;
    values.push(...categoryIds);
    paramIndex += categoryIds.length;
  }

  const whereClause = `
    WHERE p.deleted_at IS NULL
    ${filters.length > 0 ? 'AND ' + filters.join(' AND ') : ''}
  `;

  const result = await pool.query<DatabasePost>(
    `
    SELECT
      p.id,
      p.title,
      p.description,
      p.created_at,
      p.updated_at,

      u.name AS author_name,
      u.avatar_url AS author_avatar_url,
      u.id AS author_id,

      c.id AS community_id,
      c.title AS community_title,
      c.avatar_url AS community_avatar_url,
      (
        SELECT json_agg(image_url)
        FROM post_images
        WHERE post_id = p.id
      ) AS image_urls,

      (
        SELECT COUNT(*)::int
        FROM likes
        WHERE post_id = p.id
      ) AS likes_count,

      (
        SELECT COUNT(*)::int
        FROM comments
        WHERE post_id = p.id
      ) AS comments_count,

      EXISTS (
        SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1
      ) AS is_liked

    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN communities c ON c.id = p.community_id
    ${joinCategoryFilter}
    ${whereClause}
    ORDER BY p.created_at DESC;
    `,
    values,
  );

  return result.rows.map(dbPost => {
    const {
      author_id,
      author_avatar_url,
      author_name,
      created_at,
      updated_at,
      image_urls,
      likes_count,
      comments_count,
      is_liked,
      community_id,
      community_title,
      community_avatar_url,
      ...restData
    } = dbPost;

    return {
      ...restData,
      author: {
        id: author_id,
        avatarUrl: author_avatar_url,
        username: author_name,
      },
      createdAt: created_at.toISOString(),
      updatedAt: updated_at.toISOString(),
      commentsCount: comments_count,
      likesCount: likes_count,
      imageUrls: image_urls,
      isLiked: is_liked,
      community:
        community_id && community_title
          ? {
              id: community_id,
              title: community_title,
              avatarUrl: community_avatar_url,
            }
          : null,
    };
  });
};

export const GET = async (request: NextRequest) => {
  const headerUserId = request.headers.get('x-user-id');
  const { searchParams } = new URL(request.url);

  const authorId = searchParams.get('authorId') || null;
  const communityId = searchParams.get('communityId') || null;
  const categoryIds = searchParams.getAll('categoryId');
  const validCategoryIds = categoryIds.length > 0 ? categoryIds : null;

  try {
    const posts = await getPostsFromDB({
      headerUserId,
      authorId,
      communityId,
      categoryIds: validCategoryIds,
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch posts', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................

// ..................................................
// #region Create Post

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

  const { title, description, imageUrls, communityId } = payload;

  try {
    const permissionRes = await pool.query(
      `
      SELECT 
        c.author_id,
        c.only_author_can_post,
        EXISTS (
          SELECT 1 FROM community_subscriptions cs
          WHERE cs.community_id = c.id AND cs.user_id = $1
        ) AS is_subscribed
      FROM communities c
      WHERE c.id = $2 AND c.deleted_at IS NULL;
      `,
      [userId, communityId],
    );

    if (permissionRes.rowCount === 0) {
      return NextResponse.json(
        { message: 'Community not found' },
        { status: 404 },
      );
    }

    const { author_id, only_author_can_post, is_subscribed } =
      permissionRes.rows[0];

    const isAuthor = author_id === userId;
    const canPost = !only_author_can_post && is_subscribed;

    if (!isAuthor && !canPost) {
      return NextResponse.json(
        { message: 'You are not allowed to post in this community' },
        { status: 403 },
      );
    }

    const res = await pool.query(
      `
      INSERT INTO posts (user_id, title, description, community_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id;
      `,
      [userId, title, description, communityId],
    );

    const postId = res.rows[0].id;

    if (imageUrls && imageUrls.length > 0) {
      const values = imageUrls.map((_, i) => `($1, $${i + 2})`).join(', ');

      await pool.query(
        `
        INSERT INTO post_images (post_id, image_url) 
        VALUES ${values};
        `,
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

// #endregion
// ..................................................
