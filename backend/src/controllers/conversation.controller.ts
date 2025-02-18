import { Request, Response } from "express";
import conversationService from "../services/conversation.service";

class ConversationController {
    async createConversation(req: Request, res: Response): Promise<void> {
        try {
            const { userTwoId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const conversation = await conversationService.createConversation(currentUser, userTwoId);
            res.status(200).json(conversation);
        }
        catch(err) {
            console.error('Error creating conversation', err)
            res.status(500).json({ message: 'Error creating conversation' });
        }
    }
    async getConversation(req: Request, res: Response): Promise<void> {
        try {
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const conversation = await conversationService.getConversation(currentUser);
            res.status(200).json(conversation);
        }
        catch(err) {
            console.error('Error getting conversation', err)
            res.status(500).json({ message: 'Error getting conversation' });
        }
    }
}

export default new ConversationController();