'use client'

import React, { useEffect, useRef, useState } from "react";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleResetPassword } from './actions';

const PWD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function ResetPasswordPage() {
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [password, setPassword] = useState<string>('');
    const [validPwd, setValidPwd] = useState<boolean>(false);
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);

    const [message, setMessage] = useState<string | null>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const router = useRouter();

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
        const match = password === confirmPassword;
        setValidMatch(match);
    }, [password, confirmPassword]);

    useEffect(() => {
        setMessage('');
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v1 = PWD_REGEX.test(password);

        if (!v1 || !validMatch) {
            setMessage("Entrée invalide");
            setMessageType('error');
            if (errRef.current) {
                errRef.current.focus();
            }
            return;
        }

        const token = localStorage.getItem('resetToken');
        if (!token) {
            setMessage('Token non trouvé. Veuillez réessayer.');
            setMessageType('error');
            return;
        }

        const result = await handleResetPassword(token, password);
        if (result.success) {
            localStorage.removeItem('resetToken');
            setMessage('Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.');
            setMessageType('success');

            setTimeout(() => {
                router.push('/login');
            }, 5000);
        } else {
            setMessage('Une erreur s\'est produite.');
            setMessageType('error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <p ref={errRef} className={message ? (messageType === 'success' ? "text-green-500" : "text-red-500") : "hidden"} aria-live="assertive">{message}</p>
                <h1 className="text-2xl font-bold mb-6 text-center">Réinitialiser le mot de passe</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pwd" className="block text-gray-700">
                            Nouveau mot de passe:
                            <span className={validPwd ? "text-green-500 ml-2" : "hidden"}>
                                <CircleCheckBig size={20} />
                            </span>
                            <span className={validPwd || !password ? "hidden" : "text-red-500 ml-2"}>
                                <CircleX size={20} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="pwd"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            className="border rounded w-full p-2 mt-1"
                        />
                        <p id="pwdnote" className={pwdFocus && password && !validPwd ? "text-red-500" : "hidden"}>
                            1. Le mot de passe doit contenir au moins une lettre minuscule.<br />
                            2. Le mot de passe doit contenir au moins une lettre majuscule.<br />
                            3. Le mot de passe doit contenir au moins un chiffre.<br />
                            4. Le mot de passe doit contenir au moins un des caractères spéciaux suivants : !@#$%.<br />
                            5. Le mot de passe doit avoir une longueur comprise entre 8 et 24 caractères.<br />
                        </p>
                    </div>

                    <div>
                        <label htmlFor="matchPwd" className="block text-gray-700">
                            Confirmer le mot de passe:
                            <span className={validMatch && confirmPassword ? "text-green-500 ml-2" : "hidden"}>
                                <CircleCheckBig size={20} />
                            </span>
                            <span className={validMatch || !confirmPassword ? "hidden" : "text-red-500 ml-2"}>
                                <CircleX size={20} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="matchPwd"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="matchnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            className="border rounded w-full p-2 mt-1"
                        />
                        <p id="matchnote" className={matchFocus && confirmPassword && !validMatch ? "text-red-500" : "hidden"}>
                            Les mots de passe ne correspondent pas.<br />
                            Veuillez vous assurer que les deux mots de passe sont identiques.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={!validPwd || !validMatch}
                        className={`w-full p-2 rounded ${
                            !validPwd || !validMatch
                                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                : "bg-blue-500 text-white"
                        }`}
                    >
                        Réinitialiser le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
}