import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import postController from '../controllers/post.controller';

const postRouter = Router();

postRouter.post('/create-post', userAuthValidation, postController.createPost)
postRouter.get('/posts', userAuthValidation, postController.getPosts)
postRouter.patch('/edit-post', userAuthValidation, postController.editPost)
postRouter.delete('/delete-post', userAuthValidation, postController.deletePost)

export default postRouter;