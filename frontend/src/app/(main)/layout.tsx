'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar"

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
            <div className="container">
                <Navbar/>
                <div className="main-content">
                    <Sidebar/>
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </body>
        </html>
    );
}