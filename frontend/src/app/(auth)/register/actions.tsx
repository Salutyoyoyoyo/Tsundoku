'use server'

const symfonyUrl = process.env.SYMFONY_URL;

interface RegisterResponse {
    success: boolean;
    error?: string;
}

export async function HandleRegister(email: string, password: string): Promise<RegisterResponse> {
    try {
        const response = await fetch(`${symfonyUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (!response.ok) {
            let errorMessage;
            if (500 === response.status) {
                errorMessage = 'No server response';
            } else if (409 === response.status) {
                errorMessage = 'Cet email est déjà prit';
            } else {
                errorMessage = "L'inscription a échoué";
            }

            return {
                success: false,
                error: errorMessage
            };
        }

        return {
            success: true,
        };

    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred'
        };
    }
}