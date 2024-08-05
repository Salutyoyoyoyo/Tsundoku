'use server';

import { createSession } from '@/app/_lib/session';

const symfonyUrl = process.env.SYMFONY_URL;

interface LoginResponse {
    success: boolean;
    userData?: any;
    token?: string;
    error?: string;
}

export async function HandleLogin(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${symfonyUrl}/api/login_check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw response;
        }

        const data = await response.json();

        const token = data.token;
        const refreshToken = data.refresh_token
        await createSession(token, refreshToken);

        return {
            success: true,
            token: data.token,
        };

    } catch (error: any) {
        let errorMessage;

        if (error instanceof Response) {
            if (400 === error?.status) {
                errorMessage = 'Missing Email or Password';
            } else if (401 === error?.status) {
                errorMessage = 'Unauthorized';
            } else if (500 === error?.status) {
                errorMessage = 'No Server Response';
            } else {
                errorMessage = 'Login failed';
            }
        } else {
            errorMessage = 'An unexpected error occurred';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}