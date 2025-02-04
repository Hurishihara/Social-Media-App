import { Request, Response } from "express";
import LikeService from '../services/like.service';
import likeService from "../services/like.service";
import { io } from "../../server";
import { userSockets } from "../utils/socket";
import notificationService from "../services/notification.service";

class LikeController {
    async LikePost(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId, author } = req.body;
            const response = await likeService.likePost(userId, postId);
            const authorSocketId = userSockets[author];
            if (authorSocketId) {
                io.to(authorSocketId).emit('like-notification', await notificationService.createNotification('like', author, userId, postId))
            }
            if (response.message === 'Post already liked') {
                await likeService.unlikePost(userId, postId);
                console.log('Emitting unlike-notification for user:', userId, 'on post:', postId);
                io.to(authorSocketId).emit('unlike-notification', await notificationService.deleteNotification(userId))
                res.status(200).json({ message: 'Post unliked' });
            }
            else {
                res.status(200).json({ message: 'Post liked' });
            }
        }
        catch(err) {
            console.error('Error liking post', err)
            res.status(500).json({ message: 'Error liking post' });
        }
    }
}

export default new LikeController();