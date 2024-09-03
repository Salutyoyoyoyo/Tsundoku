'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/context/authContext";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

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
                <>
                    <aside>
                        <Navbar/>
                        <Sidebar/>
                    </aside>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}