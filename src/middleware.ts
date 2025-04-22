import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { jwtSecretEncoded } from '@/lib/env';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await jwtVerify(token, jwtSecretEncoded);

    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export const config: MiddlewareConfig = {
  matcher: [{ source: '/api/users/:id' }, { source: '/api/auth' }],
};
