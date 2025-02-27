import { NextFunction, Request, Response } from "express";
import commentService from "../services/comment.service";
import { userSockets } from "../utils/socket";
import notificationService from "../services/notification.service";
import { io } from "../../server";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class CommentController {
    async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { content, postId, authorId } = req.body;
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            }
            const comment = await commentService.createComment(content, currentUser, postId);
            const authorSocketId = userSockets[authorId];
            if (authorSocketId) {
                const notification = await notificationService.createNotification('comment', authorId, currentUser, null, null, comment.commentId);
                io.to(authorSocketId).emit('comment-notification', notification[0]);
            }
            res.status(200).json(comment);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

export default new CommentController();
