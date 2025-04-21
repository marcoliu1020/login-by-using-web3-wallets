'use client';

import { useTron } from '@/context/tron';
import { useState } from 'react';

export function TronConnectButton() {
  const { isConnected, address, connect, disconnect } = useTron();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Connecting...' : 'Connect TronLink'}
    </button>
  );
} 