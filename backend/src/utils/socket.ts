import { Socket } from "socket.io";

export const userSockets: Record<string, string> = {};

export function handleUserConnection(socket: Socket) {
    socket.on('join-room', (userId: string) => {
        userSockets[userId] = socket.id; 
    })

    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    })
}