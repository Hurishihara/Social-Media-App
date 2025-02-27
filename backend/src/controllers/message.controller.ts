import { NextFunction, Request, Response } from "express";
import messageService from "../services/message.service";
import { userSockets } from "../utils/socket";
import { io } from "../../server";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class MessageController {
    async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { conversationId, receiverId, content } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED))
                return;
            };
            const message = await messageService.createMessage(conversationId, currentUser, receiverId, content);
            res.status(200).json(message);
            const authorSocketId = userSockets[receiverId];
            if (authorSocketId) {
                io.to(authorSocketId).emit('new-message', message)
            };
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
    async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { conversationId } = req.params;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED))
                return;
            }
            const messages = await messageService.getMessages(parseInt(conversationId));
            res.status(200).json(messages);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

export default new MessageController();