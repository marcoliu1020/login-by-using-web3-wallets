'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { TronWeb } from 'tronweb';

interface TronContextType {
  tronWeb: TronWeb | null;
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const TronContext = createContext<TronContextType>({
  tronWeb: null,
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
});

export function TronProvider({ children }: { children: React.ReactNode }) {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if TronLink is installed
    if (typeof window !== 'undefined' && window.tronWeb) {
      setTronWeb(window.tronWeb);
    }
  }, []);

  const connect = async () => {
    try {
      if (!tronWeb) {
        throw new Error('TronLink is not installed');
      }

      // Request account access
      const accounts = await window.tronWeb.request({ method: 'tron_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect to TronLink:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  return (
    <TronContext.Provider
      value={{
        tronWeb,
        address,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </TronContext.Provider>
  );
}

export const useTron = () => {
  const context = useContext(TronContext);
  if (!context) {
    throw new Error('useTron must be used within a TronProvider');
  }
  return context;
}; 