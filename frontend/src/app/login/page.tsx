'use client'

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Eye, EyeOff, User, Lock, OctagonAlert, ArrowRight} from "lucide-react";
import {HandleLogin} from "@/app/login/actions";
import {useAuthContext} from "@/context/authContext";

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [pwd, setPwd] = useState<string>('');

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const {setIsAuthenticated} = useAuthContext();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrMsg(null);

        const response = await HandleLogin(email, pwd);
        if (response.success) {
            setIsAuthenticated(true);

            setEmail('');
            setPwd('');
            setSuccess(true);
            setErrMsg(null);
        } else {
            setErrMsg(response.error || null);
        }
    };

    return (
        <>
            {success ? (
                router.push('/home')
            ) : (
                <section>
                    <h1>Bienvenue</h1>
                    {errMsg && (
                        <div>
                            <OctagonAlert/>
                            {errMsg}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <User/>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Lock/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mot de passe"
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                required
                            />
                            <div onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff/> : <Eye/>}
                            </div>
                        </div>
                        <button type="submit">
                            Se connecter
                            <ArrowRight/>
                        </button>
                    </form>
                </section>
            )}
        </>
    );
}