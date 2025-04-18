import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  // Generate a random nonce
  const nonce = crypto.randomBytes(32).toString('hex');
  
  // Set the nonce in a cookie for verification later
  const response = new NextResponse(nonce);
  response.cookies.set('siwe-nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5, // 5 minutes
  });
  
  return response;
} 