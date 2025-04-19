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

export const useCheckSiweSession = (address: string, isConnected: boolean) => {
    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

    useEffect(() => {
        if (isConnected && address) {
            console.log('checkAuthStatusWithAddress', address);
            checkAuth();
        }

        async function checkAuth() {
            const response = await fetch(`/api/siwe-session?address=${address}`);
            const data = await response.json();
            if (!response.ok) {
                console.error('useCheckSiweSession error:', data);
                setAuthStatus('unauthenticated');
                return;
            }
            const { isAuthenticated } = data;
            setAuthStatus(isAuthenticated ? 'authenticated' : 'unauthenticated');
        };
    }, [address, isConnected]);

    return { authStatus };
};