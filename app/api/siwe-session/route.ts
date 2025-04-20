import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// util
import { logError } from '@/util/log';

// constant
import { COOKIE_SIWE_SESSION } from '../constant';

// type
import type { SiweSessionCookie } from '../type';

export async function GET(request: NextRequest) {
  // check address
  const address = request.nextUrl.searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'No address provided' }, { status: 400 });
  }

  // check session
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_SIWE_SESSION)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session found' }, { status: 400 });
  }

  // check could parse session cookie
  try {
    JSON.parse(sessionCookie);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    logError(`could not parse session cookie: ${sessionCookie}`);
    return NextResponse.json({ error: 'Invalid session cookie' }, { status: 400 });
  }

  // ✅ check session cookie is valid
  const sessionJson: SiweSessionCookie = JSON.parse(sessionCookie);
  const isAuthenticated =
    sessionJson.address === address &&
    sessionJson.authStatus === 'authenticated';

  return NextResponse.json(
    { isAuthenticated },
    { status: 200 }
  );
} 