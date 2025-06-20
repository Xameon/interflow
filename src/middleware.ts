import { NextRequest, NextResponse } from 'next/server';

import { jwtTokenVerify } from './lib';

const protectedRoutes = [
  {
    pathname: '/api/auth',
    methods: ['GET'],
  },
  {
    pathname: '/api/posts',
    methods: ['POST'],
  },
  {
    pathname: '/api/posts/:postId',
    methods: ['PUT', 'DELETE'],
  },
  {
    pathname: '/api/posts/:postId/like',
    methods: ['POST', 'DELETE'],
  },
  {
    pathname: '/api/posts/:postId/comments',
    methods: ['POST', 'DELETE'],
  },
  {
    pathname: '/api/communities',
    methods: ['POST'],
  },
  {
    pathname: '/api/communities/:communityId',
    methods: ['PUT', 'DELETE'],
  },
  {
    pathname: '/api/communities/:communityId/subscriptions',
    methods: ['POST', 'DELETE'],
  },
  {
    pathname: '/api/users/:id',
    methods: ['PUT'],
  },
  {
    pathname: '/api/users/:id/followers',
    methods: ['POST', 'DELETE'],
  },
];

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get('token');

  const { pathname } = req.nextUrl;
  const { method } = req;

  const isProtected = protectedRoutes.some(route => {
    const pattern = '^' + route.pathname.replace(/:[^/]+/g, '[^/]+') + '$';
    const regex = new RegExp(pattern);

    return regex.test(pathname) && route.methods.includes(method);
  });

  const jwtPayload = await jwtTokenVerify(token?.value);

  if (jwtPayload) {
    const { id } = jwtPayload;

    const response = NextResponse.next();

    response.headers.set('x-user-id', id);

    return response;
  }

  if (isProtected) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.next();
  response.headers.delete('x-user-id');

  return response;
};

// export const config: MiddlewareConfig = {
//   matcher: [{ source: '/' }],
// };
