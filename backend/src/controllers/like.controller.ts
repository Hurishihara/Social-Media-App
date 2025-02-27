import { NextFunction, Request, Response } from "express";
import LikeService from '../services/like.service';
import likeService from "../services/like.service";
import { io } from "../../server";
import { userSockets } from "../utils/socket";
import notificationService from "../services/notification.service";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class LikeController {
    async LikePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { author, postId } = req.body;
            const currentUser = req.user?.userId;
            if (!currentUser) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            };
            const response = await likeService.likePost(currentUser, postId);
            const authorSocketId = userSockets[author];
            
            if (response.message === 'Post already liked') {
                const response = await likeService.unlikePost(currentUser, postId);
                io.to(authorSocketId).emit('unlike-notification', response.notification)
                res.status(200).json({ message: 'Post unliked' });
            }
            else {
                if (authorSocketId) {
                    const notification = await notificationService.createNotification('like', author, currentUser, response.id);
                    io.to(authorSocketId).emit('like-notification', notification[0]);
                };
            };
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

export default new LikeController();