import { NextFunction, Request, Response } from "express";
import conversationService from "../services/conversation.service";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class ConversationController {
    async createConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userTwoId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            }
            const conversation = await conversationService.createConversation(currentUser, userTwoId);
            res.status(200).json(conversation);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
    async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            }
            const conversation = await conversationService.getConversation(currentUser);
            res.status(200).json(conversation);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

export default new ConversationController();