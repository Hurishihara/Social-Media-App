import express from 'express';
import postController from '../controllers/post.controller';
import { userAuthValidation } from '../middleware/validation';
import userController from '../controllers/user.controller';


const fileUpload = express.Router();

fileUpload.post('/create-post', userAuthValidation, postController.createPost)
fileUpload.patch('/edit-profile', userAuthValidation, userController.updateUser)

export default fileUpload;