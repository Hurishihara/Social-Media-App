import { Socket } from "socket.io";
import { io } from "../../server";

export const userSockets: Record<string, string> = {};

export function handleUserConnection(socket: Socket) {
    socket.on('join-room', (userId: string) => {
        if (userSockets[userId]) {
            const oldSocketId = userSockets[userId];
            delete userSockets[userId];
            socket.to(oldSocketId).disconnectSockets(true)
        }
        userSockets[userId] = socket.id;

        io.emit('update-user-status', { userId, status: true });
        socket.emit('online-users', Object.keys(userSockets));
    })

    socket.on('request-online-users', () => {
        socket.emit('online-users', Object.keys(userSockets));
    })

    socket.on('disconnect', () => {
        let disconnectedUserId: string | null = null;
        Object.entries(userSockets).forEach(([key, value]) => {
            if (value === socket.id) {
                disconnectedUserId = key;
                delete userSockets[key];
            }
        })
        if (disconnectedUserId) {
            io.emit('update-user-status', { userId: disconnectedUserId, status: false });
            io.emit('online-users', Object.keys(userSockets));
        }
    })
}