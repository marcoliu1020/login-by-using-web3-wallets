"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import {
    metaMaskWallet,
    walletConnectWallet,
  } from '@rainbow-me/rainbowkit/wallets';

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'b1e32aed6f915e982334fa11b7b6156b',
    chains: [mainnet, polygon, optimism, arbitrum, base],
    wallets: [
      {
        groupName: 'Recommended',
        wallets: [metaMaskWallet, walletConnectWallet]
      }
    ],
    ssr: true, // If your dApp uses server side rendering (SSR)
});