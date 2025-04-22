import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { jwtSecretEncoded } from '@/lib/env';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');

  if (!token) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, jwtSecretEncoded);

    const decoded = payload as { id: string };

    return NextResponse.json({ userId: decoded.id });
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
