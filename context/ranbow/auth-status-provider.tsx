import { RainbowKitAuthenticationProvider } from "@rainbow-me/rainbowkit";

// adapters
import { authenticationAdapter } from './auth-adapter';

// hooks
import { useCheckSiweSession } from './hooks';

export function AuthStatusProvider({ children }: { children: React.ReactNode }) {
    const { authStatus } = useCheckSiweSession();
    console.log('authStatus', authStatus);

    return (
        <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authStatus}
        >
            {children}
        </RainbowKitAuthenticationProvider>
    );
}