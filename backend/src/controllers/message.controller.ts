import { Request, Response } from "express";
import messageService from "../services/message.service";
import { userSockets } from "../utils/socket";
import { io } from "../../server";

class MessageController {
    async createMessage(req: Request, res: Response): Promise<void> {
        try {
            const { conversationId, receiverId, content } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const message = await messageService.createMessage(conversationId, currentUser, receiverId, content);
            res.status(200).json(message);
            const authorSocketId = userSockets[receiverId];
            if (authorSocketId) {
                io.to(authorSocketId).emit('new-message', message)
            }
        }
        catch(err) {
            console.error('Error creating message', err)
            res.status(500).json({ message: 'Error creating message' });
        }
    }
    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { conversationId } = req.params;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const messages = await messageService.getMessages(parseInt(conversationId));
            res.status(200).json(messages);
        }
        catch(err) {
            console.error('Error getting messages', err)
            res.status(500).json({ message: 'Error getting messages' });
        }
    }
}

export default new MessageController();