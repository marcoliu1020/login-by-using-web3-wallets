import type TronWeb from 'tronweb';

declare global {
  interface Window {
    tronWeb: TronWeb;
  }
} 