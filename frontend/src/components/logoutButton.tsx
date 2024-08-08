'use client'

import React from 'react';
import {deleteSession} from "@/app/_lib/session";
import {useAuthContext} from "@/context/authContext";
import {useRouter} from "next/navigation";

const LogoutButton = () => {
    const {setIsAuthenticated, setUser} = useAuthContext();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await deleteSession();
            setIsAuthenticated(false);
            setUser(null);
            router.push('/login');
        } catch (error) {
            throw ('Failed to Logout');
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;