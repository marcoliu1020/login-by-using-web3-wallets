import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch('/api/nonce');
    console.log('getNonce', response)
    
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

    console.log('Created message:', message)

    return message;
  },

  verify: async ({ message, signature }) => {
    console.log('Verifying with:', { message, signature })

    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });

    console.log('verifyRes', verifyRes)

    return Boolean(verifyRes.ok);
  },
  
  signOut: async () => {
    await fetch('/api/logout');
  },
});