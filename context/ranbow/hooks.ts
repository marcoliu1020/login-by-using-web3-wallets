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

export const useCheckSiweSession = (address: string) => {
    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

    useEffect(() => {
        if (!address) {
            setAuthStatus('unauthenticated');
            return;
        }

        handleAuthStatusChange();
        
        window.addEventListener('authStatusChanged', handleAuthStatusChange);
        
        return () => {
            window.removeEventListener('authStatusChanged', handleAuthStatusChange);
        };

        // Listen for auth status changes
        async function handleAuthStatusChange() {
            const hasAuth = await hasAuthSession(address);
            setAuthStatus(hasAuth ? 'authenticated' : 'unauthenticated');
        };
    }, [address]);

    return { authStatus };
};

async function hasAuthSession(address: string): Promise<boolean> {
    const response = await fetch(`/api/siwe-session?address=${address}`);
    const data = await response.json();

    if (!response.ok) {
        console.error('useCheckSiweSession error:', data);
        return false;
    }

    const { isAuthenticated } = data;
    return isAuthenticated;
}