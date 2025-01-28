import { Request, Response } from "express";
import LikeService from '../services/like.service';
import likeService from "../services/like.service";

class LikeController {
    async LikePost(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;
            const response = await likeService.likePost(userId, postId);
            if (response.message === 'Post already liked') {
                await likeService.unlikePost(userId, postId);
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