import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import type { SiweSessionCookie } from '../type';

export async function GET(request: NextRequest) {
  // check address
  const address = request.nextUrl.searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'No address provided' }, { status: 400 });
  }

  // check session
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('siwe-session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session found' }, { status: 400 });
  }

  // check could parse session cookie
  try {
    JSON.parse(sessionCookie);
  } catch (error) {
    console.error('Invalid session cookie:', error);
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