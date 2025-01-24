import { Request, Response } from "express";
import PostService from '../services/post.service'
//import { uploadImage } from "../middleware/upload";
import { upload } from "../../multer.config";


class PostController {
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
}

export default new PostController();