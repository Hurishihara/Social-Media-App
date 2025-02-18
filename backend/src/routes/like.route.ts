import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import likeController from '../controllers/like.controller';

const likeRouter = Router();

likeRouter.post('/like-post', userAuthValidation, likeController.LikePost)

export default likeRouter;
