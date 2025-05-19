import { NextRequest, NextResponse } from 'next/server';

import { getCommunitiesFromDB } from '@/lib/utils/communities.utils';
import { APIRequestContext } from '@/models';

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
