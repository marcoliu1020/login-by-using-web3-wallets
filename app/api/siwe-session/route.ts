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
  const session = cookieStore.get('siwe-session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'No session found' }, { status: 400 });
  }

  // check could parse session
  try {
    JSON.parse(session);
  } catch (error) {
    console.error('Invalid session:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  // ✅ check session data is valid
  const sessionData: SiweSessionCookie = JSON.parse(session);
  const isAuthenticated = sessionData.address === address && sessionData.authStatus === 'authenticated';

  return NextResponse.json(
    { isAuthenticated },
    { status: 200 }
  );
} 