import crypto from 'crypto';
import { NextResponse } from 'next/server';

// constant
import { COOKIE_NONCE } from '../constant';

export async function GET() {
  // Generate a random nonce
  const nonce = crypto.randomBytes(32).toString('hex');

  const response = new NextResponse(nonce);

  // Set the nonce in a cookie for verification later
  response.cookies.set(COOKIE_NONCE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5, // 5 minutes
  });

  return response;
} 