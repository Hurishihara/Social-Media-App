import { Request, Response } from "express";
import { io } from "../../server";
import { userSockets } from "../utils/socket";
import FriendshipService from '../services/friendship.service';

class FriendshipController {
    async createFriendship(req: Request, res: Response): Promise<void> {
        try {
            const { receiverId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const friendship = await FriendshipService.createFriendship('pending', currentUser, receiverId);
            res.status(200).json(friendship);
        }
        catch(err) {
            console.error('Error creating friendship', err)
            res.status(500).json({ message: 'Error creating friendship' });
        }
    }

}

export default new FriendshipController();