import { Request, Response } from "express";
import commentService from "../services/comment.service";

class CommentController {
    async createComment(req: Request, res: Response): Promise<void> {
        try {
            const { content, postId } = req.body;
            console.log('content', content)
            console.log('postId', postId)
            const currentUser = req.user?.userId;
            if (currentUser === undefined) {
                res.status(400).json({ message: 'Current user is not authenticated' });
                return;
            }
            const comment = await commentService.createComment(content, currentUser, postId)
            res.status(200).json(comment);
        }
        catch (err) {
            console.error('Error creating comment', err)
            res.status(500).json({ message: 'Error creating comment' });
        }
    }
}

export default new CommentController();
