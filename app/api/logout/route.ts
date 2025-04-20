import { NextResponse } from 'next/server';

// constant
import { COOKIE_SIWE_SESSION } from '../constant';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set(COOKIE_SIWE_SESSION, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
  });
  
  return response;
} 