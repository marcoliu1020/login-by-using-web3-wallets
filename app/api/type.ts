import { type AuthenticationStatus } from '@rainbow-me/rainbowkit';

export interface SiweSessionCookie {
    address: string;
    authStatus: AuthenticationStatus;
}