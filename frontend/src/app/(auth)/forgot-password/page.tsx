'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleForgotPassword } from '@/app/(auth)/forgot-password/actions';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await handleForgotPassword(email);

        if (result.resetToken) {
            localStorage.setItem('resetToken', result.resetToken);
        }
        setMessage(result.message);
        setMessageType(result.success ? 'success' : 'error');
    };

    const goToLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                {message && (
                    <div className={`mt-4 mb-4 text-center py-2 px-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Envoyer l'email de réinitialisation
                    </button>
                </form>
                <button
                    onClick={goToLogin}
                    className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors mt-4"
                >
                    Retour à la page de connexion
                </button>
            </div>
        </div>
    );
}