import express from 'express';
import postController from '../controllers/post.controller';
import { userAuthValidation } from '../middleware/validation';


const fileUpload = express.Router();

fileUpload.post('/create-post', userAuthValidation, postController.createPost)

export default fileUpload;