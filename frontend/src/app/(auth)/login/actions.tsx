'use server';

import { createSession } from '@/app/_lib/session';

const symfonyUrl = process.env.SYMFONY_URL;

interface LoginResponse {
    success: boolean;
    userId: number;
    email: string;
    isVerified: boolean;
    token?: string;
    error?: string;
}

export async function HandleLogin(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${symfonyUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            let errorMessage;
            if (400 === response.status) {
                errorMessage = 'Missing Email or Password';
            } else if (401 === response.status) {
                errorMessage = 'Unauthorized';
            } else if (500 === response.status) {
                errorMessage = 'No Server Response';
            } else {
                errorMessage = 'Login failed';
            }

            return {
                success: false,
                userId: 0,
                email: "",
                isVerified: false,
                error: errorMessage
            };
        }

        const data = await response.json();

        const userId = data.userId;
        const userEmail = data.email;
        const isVerified = data.isVerified;
        const token = data.token;
        const refreshToken = data.refresh_token;

        await createSession(userId, userEmail, isVerified, token, refreshToken);

        return {
            success: true,
            userId: userId,
            email: userEmail,
            isVerified: isVerified,
            token: token,
        };

    } catch (error) {
        return {
            success: false,
            userId: 0,
            email: "",
            isVerified: false,
            error: 'An unexpected error occurred',
        };
    }
}