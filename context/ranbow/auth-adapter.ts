import { logError, logMessage } from '@/util/log';

// web3 wallet
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';

// constant
import { EVENT_AUTH_STATUS_CHANGED } from './constant';

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    // TODO: get nonce
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
    // TODO: verify the message and signature
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
    window.dispatchEvent(new CustomEvent(EVENT_AUTH_STATUS_CHANGED));
    return true;
  },

  signOut: async () => {
    // TODO: sign out the user
    const response = await fetch('/api/logout', {
      method: 'POST'
    });
    const data = await response.json();

    if (!response.ok) {
      logError('Failed to sign out:', data);
    }

    logMessage('signOut res:', data);
  },
});