import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import userController from '../controllers/user.controller';
import postController from '../controllers/post.controller';

const userRouter = Router();

userRouter.get('/profile/:username', userAuthValidation, userController.searchUser)
userRouter.get('/profile/:username/posts', userAuthValidation, postController.getPostsByProfile)
userRouter.patch('/edit-profile', userAuthValidation, userController.updateUser)

export default userRouter;