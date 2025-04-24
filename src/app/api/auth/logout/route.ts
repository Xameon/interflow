import { NextResponse } from 'next/server';

export const POST = async () => {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 },
  );

  response.cookies.delete({
    name: 'token',
    path: '/',
  });

  return response;
};
