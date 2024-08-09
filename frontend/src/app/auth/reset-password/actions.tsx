'use server';

const symfonyUrl = process.env.SYMFONY_URL;

export const handleResetPassword = async (token: string | null, password: string) => {
    if (!token) {
        return { success: false, message: 'Token non fourni.' };
    }

    const response = await fetch(`${symfonyUrl}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    });
    console.log(response)

    if (!response.ok) {
        return { success: false, message: 'Une erreur s\'est produite.' };
    }

    const data = await response.json();
    if (data.success) {
        return { success: true, message: 'Votre mot de passe a été réinitialisé.' };
    } else {
        return { success: false, message: 'Une erreur s\'est produite.' };
    }
};