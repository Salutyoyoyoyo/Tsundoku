import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";

interface FetchOptions extends RequestInit {
    headers?: {
        [key: string]: string;
    };
}

export const useRefreshIfNeeded = () => {
    const { token, setToken } = useAuthContext();

    useEffect(() => {
        const refreshTokenIfNeeded = async () => {
            const refreshToken = await isTokenExpired();

            if (refreshToken) {
                const newToken = await refreshAuthToken(refreshToken);
                if (newToken) {
                    setToken(newToken);
                }
            }
        };

        refreshTokenIfNeeded();
    }, [token, setToken]);
};

export const useFetchWithAuth = () => {
    const { token } = useAuthContext();
    useRefreshIfNeeded();

    const fetchWithAuth = async (url: string | URL | Request, options: FetchOptions = {}) => {
        const headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            console.error("Request failed:", response.status, response.statusText);
            throw new Error('Request failed');
        }

        return response.json();
    };

    return fetchWithAuth;
};