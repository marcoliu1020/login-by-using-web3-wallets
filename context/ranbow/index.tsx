'use client';

// web3 wallet
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { AuthStatusProvider } from './auth-status-provider';
import { config } from './wagmi';

const queryClient = new QueryClient();

export function RainbowProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <AuthStatusProvider>
                    <RainbowKitProvider>
                        {children}
                    </RainbowKitProvider>
                </AuthStatusProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
