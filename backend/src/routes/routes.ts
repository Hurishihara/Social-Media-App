import express from 'express';
import userController from '../controllers/user.controller';
import { loginUserValidation, registerUserValidation, userAuthValidation } from '../middleware/validation';
import postController from '../controllers/post.controller';
import likeController from '../controllers/like.controller';
import notificationController from '../controllers/notification.controller';
import friendshipController from '../controllers/friendship.controller';

const router = express.Router();


router.post('/register', registerUserValidation, userController.registerUser)
router.post('/login', loginUserValidation, userController.loginUser)
router.post('/logout', userAuthValidation, userController.logoutUser)

router.post('/like-post', userAuthValidation, likeController.LikePost)
router.post('/send-friend-request', userAuthValidation, friendshipController.createFriendship)

router.get('/profile/:username', userAuthValidation, userController.searchUser)
router.get('/posts', userAuthValidation, postController.getPosts)
router.get('/notifications', userAuthValidation, notificationController.getNotifications)

router.patch('/edit-post', userAuthValidation, postController.editPost)
router.patch('/accept-friend-request', userAuthValidation, friendshipController.acceptFriendship)
router.delete('/delete-post', userAuthValidation, postController.deletePost)
router.delete('/decline-friend-request', userAuthValidation, friendshipController.cancelFriendship)

router.get('/check-auth', userAuthValidation,  (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
})




export default router;