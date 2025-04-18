import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

// types
import { type AuthenticationStatus } from '@rainbow-me/rainbowkit';

export const useLogout = () => {
    const { isDisconnected, address } = useAccount();

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    useEffect(() => {
        console.log({ isDisconnected, address });
        if (isDisconnected && !address) {
            logout();
        }
    }, [isDisconnected, address]);

    return { logout };
};

export const useCheckSiweSession = () => {
    const { address, isConnected } = useAccount();
    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

    useEffect(() => {
        if (isConnected) {
            checkAuthStatus();
        }

        async function checkAuthStatus() {
            const response = await fetch(`/api/siwe-session?address=${address}`);
            if (!response.ok) {
                const error = await response.json();
                console.error('useCheckSiweSession error:', error);
                setAuthStatus('unauthenticated');
                return;
            }
            const { isAuthenticated } = await response.json();
            setAuthStatus(isAuthenticated ? 'authenticated' : 'unauthenticated');
        };
    }, [address, isConnected]);

    return { authStatus };
};