'use client';

import LoginPage from "@/app/(auth)/login/page";
import Home from "@/app/home/page";
import {useAuthContext} from "@/context/authContext";

export default function Page() {
    const {isAuthenticated} = useAuthContext();

    return (
        <main className="">
            {!isAuthenticated ? (
                <>
                    <LoginPage/>
                </>
            ) : (
                <Home/>
            )}
        </main>
    );
}