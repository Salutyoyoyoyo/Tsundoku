import { useAuthContext } from "@/context/authContext";

interface FetchOptions extends RequestInit {
    headers?: {
        [key: string]: string;
    };
}

export const useFetchWithAuth = async (url: string | URL | Request, options: FetchOptions = {}) => {
    const { token } = useAuthContext();

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