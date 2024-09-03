'use client'

import React, { useEffect, useRef, useState } from "react";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { HandleRegister } from "@/app/(auth)/register/actions";

const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegisterPage() {
    const errRef = useRef<HTMLParagraphElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState<string>('');
    const [validEmail, setValidEmail] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);

    const [pwd, setPwd] = useState<string>('');
    const [validPwd, setValidPwd] = useState<boolean>(false);
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [matchPwd, setMatchPwd] = useState<string>('');
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);

    const [errMsg, setErrMsg] = useState<string | null>('');
    const [success, setSuccess] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);

        if (!v1 || !v2) {
            setErrMsg("Entrée invalide");
            if (errRef.current) {
                errRef.current.focus();
            }
            return;
        }

        const response = await HandleRegister(email, pwd);

        if (response.success) {
            setSuccess(true);
        } else {
            setErrMsg(response.error || null);
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    const handlePrivacyPolicyRedirect = () => {
        router.push('/policy/privacy-policy');
    };

    const handleTermsRedirect = () => {
        router.push('/policy/terms-of-service');
    };

    return (
        <>
            {success ? (
                router.push('/')
            ) : (
                <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                        <p ref={errRef} className={errMsg ? "text-red-500" : "hidden"}
                           aria-live="assertive">{errMsg}</p>
                        <h1 className="text-2xl font-bold mb-4">Page d'inscription</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-gray-700">
                                    Email:
                                    <span className={validEmail ? "text-green-500 ml-2" : "hidden"}>
                                        <CircleCheckBig size={20}/>
                                    </span>
                                    <span className={validEmail || !email ? "hidden" : "text-red-500 ml-2"}>
                                        <CircleX size={20}/>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    ref={emailRef}
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    aria-invalid={validEmail ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                    className="border rounded w-full p-2 mt-1"
                                />
                                <p id="uidnote"
                                   className={emailFocus && email && !validEmail ? "text-red-500" : "hidden"}>
                                    L'adresse électronique doit être au format : example@domain.com.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="pwd" className="block text-gray-700">
                                    Mot de passe:
                                    <span className={validPwd ? "text-green-500 ml-2" : "hidden"}>
                                        <CircleCheckBig size={20}/>
                                    </span>
                                    <span className={validPwd || !pwd ? "hidden" : "text-red-500 ml-2"}>
                                        <CircleX size={20}/>
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    id="pwd"
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                    aria-invalid={validPwd ? "false" : "true"}
                                    aria-describedby="pwdnote"
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                    className="border rounded w-full p-2 mt-1"
                                />
                                <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "text-red-500" : "hidden"}>
                                    1. Le mot de passe doit contenir au moins une lettre minuscule.<br/>
                                    2. Le mot de passe doit contenir au moins une lettre majuscule.<br/>
                                    3. Le mot de passe doit contenir au moins un chiffre.<br/>
                                    4. Le mot de passe doit contenir au moins un des caractères spéciaux suivants :
                                    !@#$%.<br/>
                                    5. Le mot de passe doit avoir une longueur comprise entre 8 et 24 caractères.<br/>
                                </p>
                            </div>

                            <div>
                                <label htmlFor="matchPwd" className="block text-gray-700">
                                    Confirmation du mot de passe:
                                    <span className={validMatch && matchPwd ? "text-green-500 ml-2" : "hidden"}>
                                        <CircleCheckBig size={20}/>
                                    </span>
                                    <span className={validMatch || !matchPwd ? "hidden" : "text-red-500 ml-2"}>
                                        <CircleX size={20}/>
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    id="matchPwd"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    required
                                    aria-invalid={validMatch ? "false" : "true"}
                                    aria-describedby="matchnote"
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                    className="border rounded w-full p-2 mt-1"
                                />
                                <p id="matchnote"
                                   className={matchFocus && matchPwd && !validMatch ? "text-red-500" : "hidden"}>
                                    Les mots de passe ne correspondent pas.<br/>
                                    Veuillez vous assurer que les deux mots de passe sont identiques.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!validEmail || !validPwd || !validMatch}
                                className={`w-full p-2 rounded ${
                                    !validEmail || !validPwd || !validMatch
                                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                        : "bg-blue-500 text-white"
                                }`}
                            >
                                S'inscrire
                            </button>
                            <p className="mt-4 text-center">
                                Déjà inscrit ?<br/>
                                <a href="/login" className="text-blue-500 underline">Page de connexion</a>
                            </p>
                        </form>
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
            )}
        </>
    );
}