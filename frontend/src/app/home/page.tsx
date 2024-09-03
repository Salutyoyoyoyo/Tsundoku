'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/context/authContext";
import LogoutButton from "@/components/logoutButton";

export default function Home() {
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const {isAuthenticated, user} = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const verifyUser = async () => {
            if (false === user.isVerified) {
                router.push('/error/unverified');
            } else if (!user) {
                setErrMsg('Failed to fetch user data');
            }
        };

        if (isAuthenticated) {
            verifyUser();
        } else {
            router.push('/login');
        }
    }, [isAuthenticated, user, router]);

    return (
            <div>
                {user ? (
                    <div>
                        <h1>Welcome Home</h1>
                        <p>Welcome Home, {user.email}</p>
                        <p>User ID: {user.userId}</p>
                        <p>Is Verified: {user.isVerified ? "Yes" : "No"}</p>
                        <LogoutButton/>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        );
    }