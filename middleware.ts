import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith('/admin')) {
      if (!token || (token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // User profile routes protection
    if (path.startsWith('/profile') || path.startsWith('/orders')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/orders/:path*', '/checkout'],
};
