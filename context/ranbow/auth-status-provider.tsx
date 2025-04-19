import { RainbowKitAuthenticationProvider } from "@rainbow-me/rainbowkit";

// adapters
import { authenticationAdapter } from './auth-adapter';

// hooks
import { useCheckSiweSession } from './hooks';
import { useAccount } from 'wagmi';

export function AuthStatusProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const { authStatus } = useCheckSiweSession(address ?? '', isConnected);

    console.log('authStatusProvider address', address);
    console.log('authStatusProvider isConnected', isConnected);
    console.log('authStatusProvider authStatus', authStatus);

    return (
        <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authStatus}
        >
            {children}
        </RainbowKitAuthenticationProvider>
    );
}