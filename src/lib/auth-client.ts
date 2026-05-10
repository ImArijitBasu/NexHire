import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/better-auth`
    : 'http://localhost:5000/api/better-auth',
});

export const { signIn, signUp, useSession, signOut } = authClient;
