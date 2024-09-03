'use server';

const symfonyUrl = process.env.SYMFONY_URL;

export const handleForgotPassword = async (email: string) => {
    try {
        const response = await fetch(`${symfonyUrl}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const resetToken = response.headers.get('X-Reset-Token');
        const data = await response.json();

        if (response.status === 429) {
            return {
                success: false,
                message: 'Vous ne pouvez demander une réinitialisation du mot de passe qu\'une fois toutes les 15 minutes.',
            };
        }

        return {
            success: data.success,
            resetToken: resetToken,
            message: data.success
                ? 'Un email de réinitialisation a été envoyé.'
                : 'Une erreur s\'est produite.',
        };
    } catch (error) {
        return { success: false, message: 'Une erreur s\'est produite.' };
    }
};
