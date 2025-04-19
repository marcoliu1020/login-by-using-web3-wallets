import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch('/api/nonce');

    if (!response.ok) {
      throw new Error('Failed to get nonce');
    }

    return await response.text();
  },

  createMessage: ({ nonce, address, chainId }) => {
    const message = createSiweMessage({
      address,
      chainId,
      domain: window.location.host,
      nonce,
      uri: window.location.origin,
      version: '1',
      statement: 'Sign in with Ethereum to the app.',
    })

    return message;
  },

  verify: async ({ message, signature }) => {
    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });

    const data = await verifyRes.json();
    console.log('verify data:', data);

    if (!verifyRes.ok) {
      throw new Error('Failed to verify:', data);
    }

    return true;
  },

  signOut: async () => {
    const res = await fetch('/api/logout');
    const data = await res.json();
    console.log('signOut res:', data);
  },
});