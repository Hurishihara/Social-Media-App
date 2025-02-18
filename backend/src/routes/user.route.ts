import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/profile/:username', userAuthValidation, userController.searchUser)
userRouter.patch('/edit-profile', userAuthValidation, userController.updateUser)

export default userRouter;