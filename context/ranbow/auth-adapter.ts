import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';

import { logMessage, logError } from '@/util/log';

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch('/api/nonce');
    const data = await response.text();

    if (!response.ok) {
      logError('Failed to get nonce');
      return '';
    }

    return data;
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
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });
    const data = await response.json();

    if (!response.ok) {
      logError('Failed to verify:', data);
      return false;
    }

    // Dispatch event after successful verification
    window.dispatchEvent(new CustomEvent('authStatusChanged'));
    return true;
  },

  signOut: async () => {
    const response = await fetch('/api/logout');
    const data = await response.json();

    if (!response.ok) {
      logError('Failed to sign out:', data);
    }

    logMessage('signOut res:', data);
  },
});