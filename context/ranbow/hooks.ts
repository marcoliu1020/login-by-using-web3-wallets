import { useEffect, useState } from 'react';

export const useHasSiweSession = (address: string): {
    hasSession: boolean,
    isLoading: boolean,
    error: Error | null
} => {
    const [hasSession, setHasSession] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const handleInitialAuthStatus = () => {
        setHasSession(false);
        setIsLoading(true);
        setError(null);
    }
    const handleHasSessionStatus = (hasAuth: boolean) => {
        setHasSession(hasAuth);
        setIsLoading(false);
        setError(null);
    }
    const haveAuthSession = async (address: string) => {
        const response = await fetch(`/api/siwe-session?address=${address}`);
        const data = await response.json();

        if (!response.ok) {
            console.error('useCheckSiweSession error:', data);
            return false;
        }

        return true;
    }

    useEffect(() => {
        if (!address) {
            handleHasSessionStatus(false);
            return;
        }

        handleAuthStatusChange();

        window.addEventListener('authStatusChanged', handleAuthStatusChange);
        return () => {
            window.removeEventListener('authStatusChanged', handleAuthStatusChange);
        };

        // Listen for auth status changes
        async function handleAuthStatusChange() {
            handleInitialAuthStatus();
            try {
                const hasAuth = await haveAuthSession(address);
                handleHasSessionStatus(hasAuth);
            } catch (error) {
                console.error('Failed to check auth status:', error);
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };
    }, [address]);

    return { hasSession, isLoading, error };
};
