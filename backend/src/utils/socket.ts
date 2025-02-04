import { Socket } from "socket.io";

export const userSockets: Record<string, string> = {};

export function handleUserConnection(socket: Socket) {
    socket.on('join-room', (userId: string) => {
        if (userSockets[userId]) {
            const oldSocketId = userSockets[userId];
            delete userSockets[userId];
            socket.to(oldSocketId).disconnectSockets(true)
        }
        userSockets[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
    })

    socket.on('disconnect', () => {
        Object.entries(userSockets).forEach(([key, value]) => {
            if (value === socket.id) {
                delete userSockets[key];
                console.log(`User ${key} disconnected`);
            }
        })
    })
}