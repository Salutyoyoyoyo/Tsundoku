'use client';

import LogoutButton from "@/components/logoutButton";
import { useAuthContext } from "@/context/authContext";

export default function Home() {
    const { user } = useAuthContext();

    return (
        <main>
            <h1>Welcome Home!</h1>
            <LogoutButton />
        </main>
    );
}