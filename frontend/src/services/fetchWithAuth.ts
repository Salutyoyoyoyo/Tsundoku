import { isTokenExpired, refreshAuthToken } from "@/services/refreshService";
import { getSession } from "@/app/_lib/session";

interface FetchOptions extends RequestInit {
    headers?: {
        [key: string]: string;
    };
}

async function getToken() {
    const session = await getSession();
    let token = session?.token;

    if (await isTokenExpired()) {
        token = await refreshAuthToken(session?.refreshToken);
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
        console.error('Error response:', response.status, response.statusText);
    }

    try {
        return {
            ok: response.ok,
            status: response.status,
            data: JSON.parse(responseData)
        };
    } catch (error) {
        return {
            ok: response.ok,
            status: response.status,
            data: responseData
        };
    }
    return response.json();
}