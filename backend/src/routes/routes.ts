import express from 'express';
import userController from '../controllers/user.controller';
import { loginUserValidation, registerUserValidation, userAuthValidation } from '../middleware/validation';
import postController from '../controllers/post.controller';
import likeController from '../controllers/like.controller';

const router = express.Router();


router.post('/register', registerUserValidation, userController.registerUser)
router.post('/login', loginUserValidation, userController.loginUser)
router.post('/logout', userAuthValidation, userController.logoutUser)

router.post('/like-post', userAuthValidation, likeController.LikePost)

router.get('/posts', userAuthValidation, postController.getPosts)

router.post('/like-post', userAuthValidation, likeController.LikePost)

router.patch('/edit-post', userAuthValidation, postController.editPost)
router.delete('/delete-post', userAuthValidation, postController.deletePost)

router.get('/check-auth', userAuthValidation,  (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
})




export default router;