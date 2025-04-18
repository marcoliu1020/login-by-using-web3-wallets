import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { verifyMessage } from 'viem';
import { parseSiweMessage } from 'viem/siwe';

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json();
    
    // Get the nonce from the cookie
    const cookieStore = await cookies();
    const nonce = cookieStore.get('siwe-nonce')?.value;
    
    if (!nonce) {
      return NextResponse.json({ error: 'No nonce found' }, { status: 400 });
    }
    
    // parse the message
    const fields = parseSiweMessage(message)

    if (!fields.address) {
      return NextResponse.json({ error: 'No address found' }, { status: 400 });
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: fields.address,
      message,
      signature,
    });
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Verify the nonce matches
    if (fields.nonce !== nonce) {
      return NextResponse.json({ error: 'Invalid nonce' }, { status: 400 });
    }

    // Set a session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('siwe-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
} 