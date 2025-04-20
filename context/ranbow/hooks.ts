import { useEffect, useState } from 'react';

export const useSiweSession = (address: string): {
    hasSession: boolean,
    isLoading: boolean,
    error: Error | null
} => {
    // state
    const [hasSession, setHasSession] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // handlers
    const handleInitialSessionStatus = () => {
        setHasSession(false);
        setIsLoading(true);
        setError(null);
    }
    const handleHasSessionStatus = (hasSession: boolean) => {
        setHasSession(hasSession);
        setIsLoading(false);
        setError(null);
    }
    const handleError = (error: Error) => {
        setHasSession(false);
        setIsLoading(false);
        setError(error);
        console.log('useSiweSession error:', error);
    }
    const hasAuthSession = async (address: string) => {
        const response = await fetch(`/api/siwe-session?address=${address}`);
        const data = await response.json();

        if (!response.ok) {
            console.error('useCheckSiweSession error:', data);
            return false;
        }

        return true;
    }

    // effects
    useEffect(() => {
        handleAuthStatusChange();

        window.addEventListener('authStatusChanged', handleAuthStatusChange);

        return () => {
            window.removeEventListener('authStatusChanged', handleAuthStatusChange);
        };

        async function handleAuthStatusChange() {
            handleInitialSessionStatus();

            if (!address) {
                handleHasSessionStatus(false);
                return;
            }
    
            try {
                const hasAuth = await hasAuthSession(address);
                handleHasSessionStatus(hasAuth);
            } catch (error) {
                handleError(error as Error);
            }
        };
    }, [address]);

    return { hasSession, isLoading, error };
};
