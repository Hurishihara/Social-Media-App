import express from 'express';
import userController from '../controllers/user.controller';
import { registerUserValidation } from '../middleware/validation';

const router = express.Router();

router.post('/register', registerUserValidation, userController.registerUser)

export default router;