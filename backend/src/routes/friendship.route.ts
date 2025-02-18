import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import friendshipController from '../controllers/friendship.controller';

const friendshipRouter = Router();

friendshipRouter.post('/send-friend-request', userAuthValidation, friendshipController.createFriendship)
friendshipRouter.get('/friends', userAuthValidation, friendshipController.getFriends)
friendshipRouter.patch('/accept-friend-request', userAuthValidation, friendshipController.acceptFriendship)
friendshipRouter.delete('/decline-friend-request', userAuthValidation, friendshipController.cancelFriendship)

export default friendshipRouter;