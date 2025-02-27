import { NextFunction, Request, Response } from "express";
import PostService from '../services/post.service'
import { upload } from "../../multer.config";
import cloudinary, { extractPublicId } from "../db/cloudinary";
import { io } from "../../server";
import notificationService from "../services/notification.service";
import postService from "../services/post.service";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";


class PostController {
    async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const currentUser = req.user?.userId
            if (!currentUser) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED))
                return
            }
            console.log('Current user', currentUser)
            const posts = await PostService.getPosts(currentUser);
            res.status(200).json(posts);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR))
            return
        }
    }

    async getPostsByProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params
            const currentUser = req.user?.userId
            if (!currentUser) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED))
                return
            }
            const posts = await postService.getPostsByProfile(username)
            res.status(200).json(posts)
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR))
            return;
        }
    }
    
    async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        upload.single('picture')(req, res, async (err) => {
            if (err) {
                next(new CustomError('Error uploading image', 'Bad Request', StatusCodes.BAD_REQUEST));
                return;
            }
            try {
                const { userId, content } = req.body;
                const imageUrl = req.file ? req.file.path : '';
                const newPost = await PostService.createPost(userId, content, imageUrl);
                io.emit('new-post', newPost[0]);
                res.status(201).json({ message: 'Post created' });
            }
            catch {
                next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
                return;
            }
        })
    }

    async editPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { postId, content } = req.body;
            await PostService.updatePost(postId, content)
            res.status(200).json({ message: 'Post updated' })
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { postId } = req.body;
            const response = await PostService.deletePost(postId);
            io.emit('delete-post', postId);
            await cloudinary.api.delete_resources(
                [extractPublicId(response)],
                { type: 'upload', resource_type: 'image'}
            )
            res.status(200).json({ message: 'Post deleted' });
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

export default new PostController();