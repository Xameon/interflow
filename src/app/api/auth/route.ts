import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ userId });
};
