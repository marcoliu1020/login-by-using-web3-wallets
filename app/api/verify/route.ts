import { logError } from '@/util/log';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// web3 wallet
import { verifyMessage } from 'viem';
import { parseSiweMessage } from 'viem/siwe';

// constant
import { COOKIE_NONCE, COOKIE_SIWE_SESSION } from '../constant';

// type
import type { SiweSessionCookie } from '../type';

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json();

    // Get the nonce from the cookie
    const cookieStore = await cookies();
    const nonce = cookieStore.get(COOKIE_NONCE)?.value;
    if (!nonce) {
      return NextResponse.json({ error: 'No nonce found' }, { status: 400 });
    }

    // Parse the message
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

    // Verify the cookie's nonce matches message's nonce
    if (fields.nonce !== nonce) {
      return NextResponse.json({ error: 'Invalid nonce' }, { status: 400 });
    }

    // Set a response
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set a session cookie
    const sessionCookie: SiweSessionCookie = {
      address: fields.address,
      authStatus: 'authenticated'
    }
    response.cookies.set(
      COOKIE_SIWE_SESSION,
      JSON.stringify(sessionCookie),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

    return response;
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
} 