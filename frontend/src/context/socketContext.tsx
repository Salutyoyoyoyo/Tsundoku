'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socket as initializeSocket } from '@/socket';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!socket) {
            const socketInstance = initializeSocket("http://localhost:3000");

            socketInstance.on('connect', () => {
                setSocket(socketInstance);
                socketInstance.emit('ping', { message: 'Hello from client' });
            });

            socketInstance.on('connect_error', () => {
            });

            socketInstance.on('disconnect', () => {
            });


            return () => {
                if (socketInstance) {
                    socketInstance.disconnect();
                }
            };
        }
    }, []);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}