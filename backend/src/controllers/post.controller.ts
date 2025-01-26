import { Request, Response } from "express";
import PostService from '../services/post.service'
//import { uploadImage } from "../middleware/upload";
import { upload } from "../../multer.config";
import cloudinary, { extractPublicId } from "../db/cloudinary";


class PostController {
    async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await PostService.getPosts();
            res.status(200).json(posts);
        }
        catch (err) {
            console.error('Error getting posts', err)
        }
    }
    
    async createPost(req: Request, res: Response): Promise<void> {
        upload.single('picture')(req, res, async (err) => {
            if (err) {
                console.error('Upload error', err)
                return res.status(500).json({ message: 'Error uploading image' });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'No image uploaded' });
            }

            try {
                const { userId, content } = req.body;
                const imageUrl = req.file.path;
                await PostService.createPost(userId, content, imageUrl);
                res.status(201).json({ message: 'Post created' });
            }
            catch (err) {
                console.error('Error creating post', err)
                res.status(500).json({ message: 'Error creating post' });
            }
        })
    }

    async editPost(req: Request, res: Response): Promise<void> {
        try {
            const { postId, content } = req.body;
            await PostService.updatePost(postId, content)
            res.status(200).json({ message: 'Post updated' })
        }
        catch(err) {
            console.error('Error updating post', err)
            res.status(500).json({ message: 'Error updating post' })
        }
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.body;
            const response = await PostService.deletePost(postId);
            await cloudinary.api.delete_resources(
                [extractPublicId(response)],
                { type: 'upload', resource_type: 'image'}
            )
            res.status(200).json({ message: 'Post deleted' });
        }
        catch(err) {
            console.error('Error deleting post', err)
            res.status(500).json({ message: 'Error deleting post' });
        }
    }
}

export default new PostController();