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

        console.log('data :', data)

        const user = {
            id: data.id,
            firstName: data.firstName,
            email: data.email,
            roles: data.roles
        };

        const token = data.token;
        await createSession(user, token);

        return {
            success: true,
            userData: user,
            token: data.token,
        };

    } catch (error: any) {
        let errorMessage;
        console.log('test :',  error)

        if (error instanceof Response) {
            if (400 === error.status) {
                errorMessage = 'Missing Email or Password';
            } else if (401 === error.status) {
                errorMessage = 'Unauthorized';
            } else if (500 === error.status) {
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