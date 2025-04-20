import { useEffect, useState } from 'react';

export type SiweSession = {
    hasSession: boolean,
    isLoading: boolean,
    error: Error | null
}

export const useSiweSession = (address: string): SiweSession => {
    // state
    const [hasSession, setHasSession] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // handlers
    const handleInitialState = () => {
        setHasSession(false);
        setIsLoading(true);
        setError(null);
    }
    const handleHasSessionState = (hasSession: boolean) => {
        setHasSession(hasSession);
        setIsLoading(false);
        setError(null);
    }
    const handleErrorState = (error: Error) => {
        setHasSession(false);
        setIsLoading(false);
        setError(error);
        console.log('useSiweSession error:', error);
    }
    const hasAuthSession = async (address: string) => {
        // TODO: add your api call here
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
            handleInitialState();

            if (!address) {
                handleHasSessionState(false);
                return;
            }
    
            try {
                const hasAuth = await hasAuthSession(address);
                handleHasSessionState(hasAuth);
            } catch (error) {
                handleErrorState(error as Error);
            }
        };
    }, [address]);

    return { hasSession, isLoading, error };
};
