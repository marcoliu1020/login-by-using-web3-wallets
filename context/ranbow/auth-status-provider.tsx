import { logMessage } from "@/util/log";

// web3 wallet
import { type AuthenticationStatus, RainbowKitAuthenticationProvider } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { authenticationAdapter } from './auth-adapter';
import { useSiweSession } from './hook/useSiweSession';

export function AuthStatusProvider({ children }: { children: React.ReactNode }) {
    // Get wallet connection status and address from wagmi hook
    const {
        address,
        isConnected: isWalletConnected,
        isConnecting: isWalletConnecting
    } = useAccount();

    // Only use wallet address if wallet is connected, otherwise empty string
    const walletAddress = isWalletConnected && address ? address : '';

    // Check if user has valid SIWE session for the connected wallet
    const {
        hasSession,
        isLoading: isSiweSessionLoading
    } = useSiweSession(walletAddress);

    // determine auth status
    let authStatus: AuthenticationStatus = "unauthenticated"
    if (isWalletConnected) {
        authStatus = hasSession ? 'authenticated' : 'unauthenticated';
    } else {
        authStatus = 'unauthenticated';
    }

    logMessage('----- authStatusProvider -----');
    logMessage({
        walletAddress,
        isWalletConnected,
        isWalletConnecting,
        hasSession,
        authStatus,
        isSiweSessionLoading
    });
    logMessage('--------------------------------');

    return (
        <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authStatus}
        >
            {children}
        </RainbowKitAuthenticationProvider>
    );
}