"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  phantomWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { arbitrum, base, bsc, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'b1e32aed6f915e982334fa11b7b6156b',
  chains: [mainnet, base, arbitrum, bsc],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, phantomWallet, walletConnectWallet]
    }
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
  multiInjectedProviderDiscovery: true, // hide injected wallets
});