import { Request, Response } from "express";
import { io } from "../../server";
import { userSockets } from "../utils/socket";
import FriendshipService from '../services/friendship.service';
import notificationService from "../services/notification.service";

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
            const authorSocketId = userSockets[receiverId];
            if (authorSocketId) {
                const notification = await notificationService.createNotification('friend_request', receiverId, currentUser, null, friendship.id)
                io.to(authorSocketId).emit('friend-request-notification', notification[0])
            }
        }
        catch(err) {
            console.error('Error creating friendship', err)
            res.status(500).json({ message: 'Error creating friendship' });
        }
    }

    async acceptFriendship(req: Request, res: Response): Promise<void> {
        try {
            const { friendshipId, receiverId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const friendship = await FriendshipService.acceptFriendship('accepted', friendshipId);
            res.status(200).json(friendship);
            const authorSocketId = userSockets[receiverId];
            if (authorSocketId) {
                const notification = await notificationService.createNotification('friend_accept', receiverId, currentUser, null, friendship.id)
                io.to(authorSocketId).emit('friend-accept-notification', notification[0])
            }
            
        }
        catch (err) {
            console.error('Error accepting friendship', err)
            res.status(500).json({ message: 'Error accepting friendship' });
        }
    }

    async cancelFriendship(req: Request, res: Response): Promise<void> {
        try {
            const { friendshipId, receiverId } = req.body;
            const currentUser = req.user?.userId;
            console.log('friendshipId', friendshipId)
            console.log('receiverId', receiverId)
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const friendship = await FriendshipService.cancelFriendship(friendshipId);
            res.status(200).json(friendship);
            const authorSocketId = userSockets[receiverId];
            if (authorSocketId) {
                io.to(authorSocketId).emit('cancel-friend-request', friendship.notification)
            }
        }
        catch (err) {
            console.error('Error declining friendship', err)
            res.status(500).json({ message: 'Error declining friendship' });
        }
    }

}

export default new FriendshipController();