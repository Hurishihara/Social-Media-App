import { Request, Response } from "express";
import LikeService from '../services/like.service';
import likeService from "../services/like.service";
import { io } from "../../server";
import { userSockets } from "../utils/socket";
import notificationService from "../services/notification.service";

class LikeController {
    async LikePost(req: Request, res: Response): Promise<void> {
        try {
            const { author, postId } = req.body;
            const currentUser = req.user?.userId;
            if (!currentUser) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const response = await likeService.likePost(currentUser, postId);
            const authorSocketId = userSockets[author];
            
            if (response.message === 'Post already liked') {
                const response = await likeService.unlikePost(currentUser, postId);
                io.to(authorSocketId).emit('unlike-notification', response.notification)
                res.status(200).json({ message: 'Post unliked' });
            }
            else {
                if (authorSocketId) {
                    const notification = await notificationService.createNotification('like', author, currentUser, response.id)
                    console.log('create notification:', notification)
                    io.to(authorSocketId).emit('like-notification', notification[0])
                }
            }
        }
        catch(err) {
            console.error('Error liking post', err)
            res.status(500).json({ message: 'Error liking post' });
        }
    }
}

export default new LikeController();