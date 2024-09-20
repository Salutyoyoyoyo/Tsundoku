import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";
import { getSession } from "@/app/_lib/session";

interface FetchOptions extends RequestInit {
    headers?: {
        [key: string]: string;
    };
}

async function getToken() {
    const session = await getSession();
    let token: unknown = session?.token;

    if (token && await isTokenExpired()) {
        const newToken = await refreshAuthToken(session?.refreshToken);
        if (newToken) {
            token = newToken;
        }
    }
    return token;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    const token = await getToken();
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
    const responseData = await response.text();

    if (!response.ok) {
        return {
            response: false,
            status: response.status,
            message: response.statusText,
            error: responseData || 'Unknown error occurred'
        };
    }

    try {
        return {
            response: response.ok,
            status: response.status,
            data: JSON.parse(responseData)
        };
    } catch (error) {
        return {
            response: response.ok,
            status: response.status,
            data: responseData
        };
    }
    return response.json();
}