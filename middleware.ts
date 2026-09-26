import { NextResponse } from 'next/server';

/**
 * Middleware stub — currently no active middleware logic needed.
 * PostHog proxying is handled by the /relay/[...path] API route instead,
 * because NextResponse.rewrite() to external URLs does not work in
 * standalone production builds.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  // Match nothing — middleware is a no-op for now.
  matcher: [],
};
