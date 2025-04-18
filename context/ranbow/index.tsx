'use client';

import {
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    type AuthenticationStatus,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';

import { config } from './config';
import { authenticationAdapter } from './createAuthenticationAdapter';

const queryClient = new QueryClient();

export function RainbowProvider({ children }: { children: React.ReactNode }) {
    const authStatus: AuthenticationStatus = 'unauthenticated';
    
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitAuthenticationProvider
                    adapter={authenticationAdapter}
                    status={authStatus}
                >
                    <RainbowKitProvider>
                        {children}
                    </RainbowKitProvider>
                </RainbowKitAuthenticationProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
