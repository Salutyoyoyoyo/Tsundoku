'use server';

import { verifySession } from "@/app/_lib/session";
import {jwtDecode} from "jwt-decode";

const symfonyUrl = process.env.SYMFONY_URL;

interface DecodedToken {
    exp: number;
}

export const refreshAuthToken = async (refreshToken: unknown): Promise<string | null> => {
    try {
        const response = await fetch(`${symfonyUrl}/api/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'refresh_token': refreshToken })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};

export const isTokenExpired = async (): Promise<unknown> => {
    try {
        const payload = await verifySession();

        if (!payload || !payload.userData || !payload.userData.token) {
            return false;
        }

        const token = payload.userData.token;
        const refreshToken = payload.userData.refreshToken;
        const decodedToken: DecodedToken = jwtDecode(token as string);

        const currentTime = Date.now() / 1000;
        const isExpired = decodedToken.exp <= currentTime;

        if (isExpired) {
            return refreshToken;
        }
    } catch (error) {
        console.error("Error checking token expiration:", error);
        return false;
    }
};