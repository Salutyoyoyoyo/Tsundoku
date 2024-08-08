'use server'

const symfonyUrl = process.env.SYMFONY_URL;

export const handleResendVerification = async (email: string) => {
    const response = await fetch(`${symfonyUrl}/resend-confirmation`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
    });

    if (!response.ok) {
        return {success: false, message: 'Failed to resend verification email'};
    } else {
        return {success: true, message: 'Verification email resent successfully'};
    }
};
