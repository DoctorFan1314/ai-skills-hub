import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // X-Request-Id for all responses (Web Crypto API — works in Edge runtime)
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  response.headers.set('X-Request-Id', requestId);

  // Protect dashboard routes (except login/register)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('oortapi_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
