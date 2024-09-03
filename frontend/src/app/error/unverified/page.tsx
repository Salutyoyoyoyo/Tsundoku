'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuthContext } from "@/context/authContext";
import { handleResendVerification} from './actions';
import {deleteSession} from "@/app/_lib/session";

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
            setMessage("Échec de l'envoi de l'email de vérification.");
            setMessageType('error');
        }
    };

    const logout = async () => {
        await deleteSession();
        router.push('/login');
    };

    return (
        <section>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <AlertCircle style={{ color: 'red', fontSize: '4rem' }} />
                <h1>Compte non vérifié</h1>
                <p>Pour vérifier votre compte, merci de cliquer sur le lien que nous vous avons envoyé par e-mail.</p>
                <button onClick={resendVerification} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Renvoyer l'email de vérification
                </button>
                <button onClick={logout} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '4px' }}>
                    Retour à la page de connexion
                </button>
                {message && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        color: messageType === 'success' ? 'green' : 'red',
                        border: `1px solid ${messageType === 'success' ? 'green' : 'red'}`,
                        borderRadius: '4px'
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </section>
    );
}