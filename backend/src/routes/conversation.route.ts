import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import conversationController from '../controllers/conversation.controller';

const conversationRouter = Router();

conversationRouter.post('/create-conversation', userAuthValidation, conversationController.createConversation)
conversationRouter.get('/get-conversation', userAuthValidation, conversationController.getConversation)

export default conversationRouter;