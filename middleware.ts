import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';
 
export default auth((req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url', req.url);
  
  // Pass the environment flag to indicate if this is in a CI environment
  requestHeaders.set('x-is-ci', process.env.CI === 'true' ? 'true' : 'false');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
