'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, OctagonAlert, ArrowRight } from "lucide-react";
import { HandleLogin } from "@/app/(auth)/login/actions";
import { useAuthContext } from "@/context/authContext";

export default function LoginPage() {
    const [email, setEmail] = useState<string>('yoyoyoy1zszezo1.1234@hotmail.com');
    const [pwd, setPwd] = useState<string>('testtest');

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const { setUser, setIsAuthenticated } = useAuthContext();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrMsg(null);
        const response = await HandleLogin(email, pwd);
        if (response.success) {
            setIsAuthenticated(true);

            const { userId, email: userEmail, isVerified } = response;
            setUser({ userId, email: userEmail, isVerified });

            setEmail('');
            setPwd('');
            setErrMsg(null);

            router.push('/');
        } else {
            setErrMsg(response.error || null);
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register');
    };

    const handleForgotPasswordRedirect = () => {
        router.push('/forgot-password');
    };

    const handlePrivacyPolicyRedirect = () => {
        router.push('/policy/privacy-policy');
    };

    const handleTermsRedirect = () => {
        router.push('/policy/terms-of-service');
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Bienvenue</h1>
                {errMsg && (
                    <div className="flex items-center bg-red-100 text-red-700 p-4 mb-4 rounded-md">
                        <OctagonAlert className="mr-2"/>
                        <span>{errMsg}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            <User className="inline-block mr-2"/>
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
                    <div className="mb-6">
                        <label className="block text-gray-700">
                            <Lock className="inline-block mr-2"/>
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mot de passe"
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff/> : <Eye/>}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Se connecter
                        <ArrowRight className="inline-block ml-2"/>
                    </button>
                </form>
                <button
                    onClick={handleRegisterRedirect}
                    className="w-full mt-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                    S'inscrire
                </button>
                <button
                    onClick={handleForgotPasswordRedirect}
                    className="w-full mt-2 text-blue-500 hover:underline"
                >
                    Mot de passe oublié ?
                </button>
            </div>
                <div className="text-center mt-6">
                    <a
                        href="#"
                        onClick={handlePrivacyPolicyRedirect}
                        className="text-blue-500 hover:underline"
                    >
                        Politique de confidentialité
                    </a>
                    &nbsp;|&nbsp;
                    <a
                        href="#"
                        onClick={handleTermsRedirect}
                        className="text-blue-500 hover:underline"
                    >
                        Conditions générales
                    </a>
                </div>
        </section>
    );
}