'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar"
import {SocketProvider} from "@/context/socketContext";
import React from "react";

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SocketProvider>
            <div className="container">
                <Navbar/>
                <div className="main-content">
                    <Sidebar/>
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </SocketProvider>
        </body>
        </html>
    );
}