'use client'

import React from 'react';
import {deleteSession} from "@/app/_lib/session";
import {useAuthContext} from "@/context/authContext";
import {Button} from "@/components/ui/button";
import {Plug} from "lucide-react";

const LogoutButton = () => {
    const {setIsAuthenticated, setUser} = useAuthContext();
    const handleLogout = async () => {
        try {
            await deleteSession();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            throw new Error('Failed to Logout');
        }
    };

    return (
        <Button onClick={handleLogout} className="flex items-center text-black bg-transparent outline-none focus:outline-none hover:bg-hover-bg-color">
            <Plug className="mr-2 w-4"/>
            Se déconnecter
        </Button>
    );
};

export default LogoutButton;