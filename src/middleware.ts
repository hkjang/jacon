import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('jacon_session')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedPath = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/inventory') ||
    request.nextUrl.pathname.startsWith('/workloads') || 
    request.nextUrl.pathname.startsWith('/policy') ||
    request.nextUrl.pathname.startsWith('/config') ||
    request.nextUrl.pathname.startsWith('/observability') ||
    request.nextUrl.pathname.startsWith('/endpoints') ||
    request.nextUrl.pathname.startsWith('/deploy');

  // Case 1: Unauthenticated trying to access protected
  if (isProtectedPath && !sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Case 2: Authenticated trying to access login
  if (isLoginPage && sessionId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/inventory/:path*',
    '/workloads/:path*',
    '/policy/:path*',
    '/config/:path*',
    '/observability/:path*',
    '/endpoints/:path*',
    '/deploy/:path*',
    '/login'
  ],
};
