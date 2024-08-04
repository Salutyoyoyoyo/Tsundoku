'use client';

import LogoutButton from "@/app/components/logoutButton";
import { useAuthContext } from "@/context/authContext";

export default function Home() {
    const { user } = useAuthContext();

    return (
        <main>
            <h1>Welcome Home {user.firstName}!</h1>
            <LogoutButton />
        </main>
    );
}