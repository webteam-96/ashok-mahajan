import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Clone the request headers and set x-pathname so layouts can detect the current path
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Run on all routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
