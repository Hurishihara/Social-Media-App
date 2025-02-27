import express from 'express';
import authRouter from './auth.route';
import conversationRouter from './conversation.route';
import friendshipRouter from './friendship.route';
import likeRouter from './like.route';
import messageRouter from './message.route';
import notificationRouter from './notification.route';
import postRouter from './post.route';
import userRouter from './user.route';
import commentRouter from './comment.route';
import errorHandler from '../middleware/error.handler';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/conversation', conversationRouter);
router.use('/friendship', friendshipRouter);
router.use('/like', likeRouter);
router.use('/message', messageRouter);
router.use('/notification', notificationRouter);
router.use('/post', postRouter);
router.use('/user', userRouter);
router.use('/comment', commentRouter);

router.use(errorHandler);

export default router;