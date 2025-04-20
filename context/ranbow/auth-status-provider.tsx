import { type AuthenticationStatus, RainbowKitAuthenticationProvider } from "@rainbow-me/rainbowkit";

// adapters
import { authenticationAdapter } from './auth-adapter';

// hooks
import { useAccount } from 'wagmi';
import { useSiweSession } from './hook/useSiweSession';

export function AuthStatusProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const { hasSession } = useSiweSession(address ?? '');

    // determine auth status
    let authStatus: AuthenticationStatus = 'loading';
    if (isConnected) {
        authStatus = hasSession ? 'authenticated' : 'unauthenticated';
    }

    console.log('----- authStatusProvider -----');
    console.log({ address, isConnected, hasSession, authStatus });
    console.log('--------------------------------');

    return (
        <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authStatus}
        >
            {children}
        </RainbowKitAuthenticationProvider>
    );
}