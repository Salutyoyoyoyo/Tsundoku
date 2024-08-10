'use client';

import LogoutButton from "@/components/logoutButton";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import ConversationPage from "@/app/(chat)/conversations/page";

export default function Home() {
    return (
        <>
            <aside>
                <Navbar />
                <Sidebar />
            </aside>
        </>
    );
}