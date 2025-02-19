import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from '../store/user.store'

const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [ socket, setSocket ] = React.useState<Socket | null>(null)
    const { userId } = useUserStore()
    
    React.useEffect(() => {
        if (!userId) return;
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.emit('join-room', userId)

        return () => {
            newSocket.disconnect()
        }
    }, [userId]);

    return <SocketContext.Provider value={socket}> { children } </SocketContext.Provider>
}