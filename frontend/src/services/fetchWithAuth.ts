import { useAuthContext } from "@/context/authContext";
import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";

interface FetchOptions extends RequestInit {
    headers?: {
        [key: string]: string;
    };
}

export const useFetchWithAuth = async (url: string | URL | Request, options: FetchOptions = {}) => {
    const { token } = useAuthContext();

    await useRefreshIfNeeded();

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
        console.error(!response.ok);
    }
    return response.json();
};

export const useRefreshIfNeeded = async () => {
    const { setToken } = useAuthContext();
    const refreshToken = await isTokenExpired();

    if (refreshToken) {
        const newToken = await refreshAuthToken(refreshToken);
        if (newToken) {
            setToken(newToken);
        }
    }
};