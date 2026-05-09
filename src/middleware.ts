import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin route protection - check is done client-side
  // This middleware adds security headers only
  const response = NextResponse.next();

  // Prevent caching of authenticated pages
  if (request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/profile')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
