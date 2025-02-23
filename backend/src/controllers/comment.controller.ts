import { Request, Response } from "express";
import commentService from "../services/comment.service";
import { userSockets } from "../utils/socket";
import notificationService from "../services/notification.service";
import { io } from "../../server";

class CommentController {
    async createComment(req: Request, res: Response): Promise<void> {
        try {
            const { content, postId, authorId } = req.body;
            console.log('content', content)
            console.log('postId', postId)
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const comment = await commentService.createComment(content, currentUser, postId)
            const authorSocketId = userSockets[authorId]
            if (authorSocketId) {
                const notification = await notificationService.createNotification('comment', authorId, currentUser, null, null, comment.commentId)
                io.to(authorSocketId).emit('comment-notification', notification[0])
            }
            res.status(200).json(comment);
        }
        catch (err) {
            console.error('Error creating comment', err)
            res.status(500).json({ message: 'Error creating comment' });
        }
    }
}

export default new CommentController();
