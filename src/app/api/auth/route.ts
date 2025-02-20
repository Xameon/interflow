import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '@/lib/env';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization');

  if (!token) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    return NextResponse.json({ userId: decoded.id });
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
