import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import socketService from '../services/socket';
import { RootState } from '../store/store';

interface SocketContextData {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextData>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const user = useSelector((state: RootState) => state.auth.user);
    const roomIds = Array.from(
        new Set(
            [user?.userId, user?.id, (user as any)?._id]
                .filter((v) => v !== undefined && v !== null)
                .map((v) => String(v))
        )
    );

    useEffect(() => {
        const socket = socketService.init(token || undefined);

        const onConnect = () => {
            console.log("Socket connected:", socket.id);
            setIsConnected(true);
            roomIds.forEach((id) => socket.emit('join_room', `user:${id}`));
        };

        const onDisconnect = () => setIsConnected(false);
        const onError = (err: any) => console.error("Socket error:", err);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onError);

        if (token) {
            socket.connect();
        }

        // If already connected, join room now (since onConnect might not fire again)
        if (socket.connected) {
            roomIds.forEach((id) => {
                console.log("Socket already connected, joining room for:", id);
                socket.emit('join_room', `user:${id}`);
            });
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onError);
            // Optional: socket.disconnect() if you want to close on unmount
            // but often we keep it open for background tasks if needed
        };
    }, [token, roomIds.join('|')]);

    return (
        <SocketContext.Provider value={{ socket: socketService.getSocket(), isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
