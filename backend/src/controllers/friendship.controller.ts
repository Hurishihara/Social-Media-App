import { NextFunction, Request, Response } from "express";
import { io } from "../../server";
import { userSockets } from "../utils/socket";
import FriendshipService from '../services/friendship.service';
import notificationService from "../services/notification.service";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class FriendshipController {
    async createFriendship(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { receiverId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
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
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }

    async acceptFriendship(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { friendshipId, receiverId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
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
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }

    async cancelFriendship(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { friendshipId, receiverId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            }
            const friendship = await FriendshipService.cancelFriendship(friendshipId);
            res.status(200).json(friendship);
            const authorSocketId = userSockets[receiverId];
            if (authorSocketId) {
                io.to(authorSocketId).emit('cancel-friend-request', friendship.notification)
            }
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
    async getFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            }
            const { userId } = req.query;
            const friends = await FriendshipService.getFriends(Number(userId));
            res.status(200).json(friends);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }

}

export default new FriendshipController();