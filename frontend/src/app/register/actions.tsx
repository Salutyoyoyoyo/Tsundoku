'use server'

const symfonyUrl = process.env.SYMFONY_URL;

interface RegisterResponse {
    success: boolean;
    error?: string;
}

export async function HandleRegister(email: string, password: string): Promise<RegisterResponse> {
    console.log({email: email, password: password});
    try {
        const response = await fetch(`${symfonyUrl}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email, password: password}),
        });
        if (!response.ok) {
            throw response;
        }

        return {
            success: true,
        }
    } catch (error: any) {
        let errorMessage;
        console.log('error 2:', error)
        if (error instanceof Response) {
            if (500 === error?.status) {
                errorMessage = 'No server response';
            } else if (409 === error?.status) {
                errorMessage = 'Cet email est déjà prit';
            } else {
                errorMessage = "L'inscription a échoué";
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