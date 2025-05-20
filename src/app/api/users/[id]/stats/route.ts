import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { APIRequestContext } from '@/models';
import {
  DatabaseUser,
  DatabaseUserStats,
  UserStats,
} from '@/models/users.model';

// ..................................................
// #region Get User Stats

const getUserStats = async (userId: string): Promise<UserStats> => {
  const result = await pool.query<DatabaseUserStats>(
    `
    SELECT
      (SELECT COUNT(*) FROM subscriptions WHERE following_id = $1)::int AS followers_count,
      (SELECT COUNT(*) FROM subscriptions WHERE follower_id = $1)::int AS following_count,
      (SELECT COUNT(*) FROM communities WHERE author_id = $1)::int AS communities_count,
      (SELECT COUNT(*) FROM community_subscriptions WHERE user_id = $1)::int AS followed_communities_count
    `,
    [userId],
  );

  const row = result.rows[0];

  return {
    userId,
    followersCount: row.followers_count,
    followingCount: row.following_count,
    communitiesCount: row.communities_count,
    followedCommunitiesCount: row.followed_communities_count,
  };
};

export const GET = async (
  _: NextRequest,
  { params }: APIRequestContext<{ id: string }>,
) => {
  const { id: userId } = await params;

  const res = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

  const user = res.rows[0] as DatabaseUser | undefined;

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  try {
    const stats = await getUserStats(userId);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch stats', error },
      { status: 500 },
    );
  }
};

// #endregion
// ..................................................
