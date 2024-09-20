'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuthContext } from "@/context/authContext";
import { handleResendVerification } from './actions';
import { deleteSession } from "@/app/_lib/session";

export default function UnverifiedPage() {
    const { user } = useAuthContext();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const router = useRouter();

    const resendVerification = async () => {
        const result = await handleResendVerification(user.email);
        if (result.success) {
            setMessage('Email de vérification renvoyé avec succès.');
            setMessageType('success');
        } else {
            setMessage("Échec de l&apos;envoi de l&apos;email de vérification.");
            setMessageType('error');
        }
    };

    const logout = async () => {
        await deleteSession();
        router.push('/login');
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Compte non vérifié</h1>
            <p className="mb-6">Pour vérifier votre compte, merci de cliquer sur le lien que nous vous avons envoyé par e-mail.</p>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={resendVerification}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                    Renvoyer l&apos;email de vérification
                </button>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 focus:outline-none"
                >
                    Retour à la page de connexion
                </button>
            </div>
            {message && (
                <div className={`mt-6 px-4 py-2 border rounded ${messageType === 'success' ? 'text-green-700 border-green-700' : 'text-red-700 border-red-700'}`}>
                    {message}
                </div>
            )}
        </section>
    );
}