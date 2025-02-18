import { Router } from 'express';
import { userAuthValidation } from '../middleware/validation';
import messageController from '../controllers/message.controller';

const messageRouter = Router();

messageRouter.post('/send-message', userAuthValidation, messageController.createMessage)
messageRouter.get('/get-messages/:conversationId', userAuthValidation, messageController.getMessages)

export default messageRouter;