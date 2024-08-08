'use client';

import {createContext, useContext, useEffect, useState} from "react";
import {getSession, deleteSession} from "@/app/_lib/session";
import {useRouter} from "next/navigation";

interface User {
    userId: unknown;
    email: unknown;
    isVerified: unknown;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
    token: string | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | any>(undefined);

export function AuthProvider({children}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuthBySession = async () => {
            try {
                const session = await getSession();
                if (session && session.token) {
                    if (session.isVerified === false) {
                        router.push('/error/unverified');
                        return;
                    }
                    setUser({ userId: session.userId, email: session.email, isVerified: session.isVerified });
                    setIsAuthenticated(true);
                    setToken(session.token as string);
                    setError(null);
                } else {
                    setError('Error: session or userData are invalid');
                }
            } catch (error) {
                setError('Erreur: failed to get session');
            }
        };
        checkAuthBySession();
    }, []);

    const logout = async () => {
        await deleteSession();
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, token, setToken, user, setUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}