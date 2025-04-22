import { jwtVerify } from 'jose';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { jwtSecretEncoded } from '@/lib/env';

type JwtPayload = {
  id: string;
};

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, jwtSecretEncoded);

    const { id } = payload as JwtPayload;

    const response = NextResponse.next();

    response.headers.set('x-user-id', id);

    return response;
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    { source: '/api/users/:id' },
    { source: '/api/auth' },
    { source: '/api/posts' },
  ],
};
